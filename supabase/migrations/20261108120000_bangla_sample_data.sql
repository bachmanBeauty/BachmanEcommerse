-- বাংলা নমুনা ডেটা: ক্যাটাগরি ও ডেমো প্রোডাক্টের নাম/বর্ণনা বাংলায়

update public.categories set name = 'ক্লিনজার' where slug = 'cleanser';
update public.categories set name = 'টোনার' where slug = 'toner';
update public.categories set name = 'সিরাম' where slug = 'serum';
update public.categories set name = 'ময়েশ্চারাইজার' where slug = 'moisturizer';
update public.categories set name = 'সানস্ক্রিন' where slug = 'sunscreen';
update public.categories set name = 'ফেস মাস্ক' where slug = 'face-mask';

update public.products set
  name = 'জেন্টল জেল ক্লিনজার',
  short_description = 'প্রতিদিনের জন্য কোমল ফোম ক্লিনজার — তেল ও ধুলো দূর করে, ত্বক শুষ্ক করে না।',
  description = 'প্রতিদিন ব্যবহারের জন্য কোমল জেল ক্লিনজার। সহজে ধুয়ে যায়, ত্বক আরামদায়ক রাখে এবং রুটিনের বাকি ধাপের জন্য প্রস্তুত করে।',
  how_to_use = 'ভেজা ত্বকে সকাল ও রাতে আলতো করে ম্যাসাজ করুন। কুসুম গরম পানিতে ধুয়ে ফেলুন।'
where slug = 'gentle-gel-cleanser';

update public.products set
  name = 'হাইড্রেটিং টোনার',
  short_description = 'অ্যালকোহল-মুক্ত টোনার, হায়ালুরোনিক অ্যাসিড ও গ্রিন টি দিয়ে ত্বক আর্দ্র ও শান্ত রাখে।',
  description = 'ক্লিনজিংয়ের পর ত্বকে আর্দ্রতার একটি স্তর যোগ করে এবং সিরামের জন্য প্রস্তুত করে।',
  how_to_use = 'পরিষ্কার ত্বকে কয়েক ফোঁটা হাতের তালু বা কটন প্যাডে নিয়ে লাগান।'
where slug = 'hydrating-toner';

update public.products set
  name = 'ভিটামিন সি গ্লো সিরাম',
  short_description = '১০% ভিটামিন সি সমৃদ্ধ ব্রাইটেনিং সিরাম, ত্বকের রং সমান করে উজ্জ্বলতা বাড়ায়।',
  description = 'ফেরুলিক অ্যাসিড ও ভিটামিন ই সহ স্থিতিশীল ভিটামিন সি সিরাম, প্রতিদিনের অ্যান্টিঅক্সিডেন্ট সাপোর্টের জন্য।',
  how_to_use = 'সকালে পরিষ্কার ত্বকে ৩–৪ ফোঁটা লাগান, ময়েশ্চারাইজার ও সানস্ক্রিনের আগে।'
where slug = 'vitamin-c-glow-serum';

update public.products set
  name = 'সিরামাইড ময়েশ্চারাইজার',
  short_description = 'সিরামাইড সমৃদ্ধ ক্রিম, ত্বকের বাধা মজবুত করে আর্দ্রতা ধরে রাখে।',
  description = 'সিরামাইড, স্কোয়ালেন ও গ্লিসারিনযুক্ত আরামদায়ক দৈনিক ময়েশ্চারাইজার, দীর্ঘস্থায়ী হাইড্রেশনের জন্য।',
  how_to_use = 'সকাল ও রাতে রুটিনের শেষ ধাপে মুখ ও গলায় আলতো করে লাগান।'
where slug = 'ceramide-moisturizer';

update public.products set
  name = 'ইনভিজিবল সানস্ক্রিন এসপিএফ ৫০',
  short_description = 'হালকা, সাদা দাগহীন সানস্ক্রিন — প্রতিদিন UVA ও UVB থেকে সুরক্ষা।',
  description = 'দ্রুত শোষণকারী সানস্ক্রিন, মেকআপের নিচেও ভালো বসে এবং আর্দ্র আবহাওয়ার জন্য উপযুক্ত।',
  how_to_use = 'সকালের রুটিনের শেষ ধাপে যথেষ্ট পরিমাণে লাগান। বাইরে থাকলে প্রতি ২–৩ ঘণ্টায় আবার লাগান।'
where slug = 'invisible-sunscreen-spf-50';

update public.products set
  name = 'ক্লে ডিটক্স মাস্ক',
  short_description = 'সাপ্তাহিক কেওলিন ও চারকোল মাস্ক, ত্বক পরিষ্কার করে অতিরিক্ত শুষ্ক না করে।',
  description = 'কেওলিন, চারকোল ও অ্যালোভেরাযুক্ত ক্রিমি ক্লে মাস্ক, ক্লান্ত ত্বক সতেজ করে।',
  how_to_use = 'সপ্তাহে এক–দুইবার পরিষ্কার ত্বকে পাতলা স্তর লাগান। ১০ মিনিট রেখে ধুয়ে ফেলুন।'
where slug = 'clay-detox-mask';
