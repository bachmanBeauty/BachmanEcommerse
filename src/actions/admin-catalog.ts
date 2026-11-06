"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { bool, list, numberOrNull, text } from "@/lib/form";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

function productPayload(formData: FormData) {
  const name = text(formData, "name");
  if (!name) throw new Error("Product name is required.");

  return {
    name,
    slug: text(formData, "slug") || slugify(name),
    sku: text(formData, "sku") || null,
    category_id: text(formData, "category_id") || null,
    short_description: text(formData, "short_description") || null,
    description: text(formData, "description") || null,
    brand: text(formData, "brand") || null,
    ingredients: text(formData, "ingredients") || null,
    how_to_use: text(formData, "how_to_use") || null,
    skin_type: list(formData, "skin_type"),
    base_price: Number(text(formData, "base_price") || 0),
    compare_at_price: numberOrNull(formData, "compare_at_price"),
    is_active: bool(formData, "is_active"),
    is_featured: bool(formData, "is_featured"),
    meta_title: text(formData, "meta_title") || null,
    meta_description: text(formData, "meta_description") || null,
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(productPayload(formData))
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect(`/admin/products/${data.id}`);
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update(productPayload(formData))
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function addVariant(formData: FormData) {
  await requireAdmin();
  const productId = text(formData, "product_id");
  const supabase = await createClient();
  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    name: text(formData, "name") || "Default",
    sku: text(formData, "sku") || null,
    price: Number(text(formData, "price") || 0),
    stock_quantity: Number(text(formData, "stock_quantity") || 0),
    is_active: true,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function updateVariant(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const productId = text(formData, "product_id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_variants")
    .update({
      name: text(formData, "name"),
      sku: text(formData, "sku") || null,
      price: Number(text(formData, "price") || 0),
      stock_quantity: Number(text(formData, "stock_quantity") || 0),
      is_active: bool(formData, "is_active"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function deleteVariant(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const productId = text(formData, "product_id");
  const supabase = await createClient();
  const { error } = await supabase.from("product_variants").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  const productId = text(formData, "product_id");
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload.");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Only JPG, PNG or WebP images are allowed.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const supabase = await createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url: publicUrl.publicUrl,
    alt: text(formData, "alt") || null,
    sort_order: count ?? 0,
    is_primary: (count ?? 0) === 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const productId = text(formData, "product_id");
  const url = text(formData, "url");
  const supabase = await createClient();

  const marker = "/product-images/";
  if (url.includes(marker)) {
    const path = decodeURIComponent(url.split(marker)[1]);
    await supabase.storage.from("product-images").remove([path]);
  }

  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function setPrimaryImage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const productId = text(formData, "product_id");
  const supabase = await createClient();

  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  const { error } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = text(formData, "name");
  if (!name) throw new Error("Category name is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug: text(formData, "slug") || slugify(name),
    description: text(formData, "description") || null,
    image_url: text(formData, "image_url") || null,
    sort_order: Number(text(formData, "sort_order") || 0),
    is_active: bool(formData, "is_active"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: text(formData, "name"),
      slug: text(formData, "slug"),
      description: text(formData, "description") || null,
      image_url: text(formData, "image_url") || null,
      sort_order: Number(text(formData, "sort_order") || 0),
      is_active: bool(formData, "is_active"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}
