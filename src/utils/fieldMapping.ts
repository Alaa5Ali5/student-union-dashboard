// Mapping للمجالات الإعلامية من الإنجليزية إلى العربية
export const fieldMapping: Record<string, string> = {
  'photography': 'التصوير الفوتوغرافي والفيديو',
  'voiceover': 'التعليق الصوتي والتقديم',
  'montage': 'المونتاج وتحرير الفيديو',
  'graphic_design': 'التصميم الجرافيكي',
  'content_writing': 'كتابة المحتوى الإعلامي',
  'social_media': 'إدارة وسائل التواصل الاجتماعي',
  'live_streaming': 'البث المباشر والتغطية الحية',
};

// دالة لترجمة اسم المجال
export const translateFieldName = (fieldName: string): string => {
  return fieldMapping[fieldName] || fieldName;
};
