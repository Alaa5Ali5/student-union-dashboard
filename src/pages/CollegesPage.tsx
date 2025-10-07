// src/pages/CollegesPage.tsx
import { useState } from 'react';
import { Title, Table, Loader, Alert, Button, Group, Modal, Stack, TextInput, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getColleges, createCollege, type College } from '../services/api';

export function CollegesPage() {
  const [modalOpened, setModalOpened] = useState(false);
  const queryClient = useQueryClient();

  // 1. جلب بيانات الكليات
  const { data: colleges, isLoading, isError, error } = useQuery<College[], Error>({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  // 2. إعداد النموذج لإنشاء كلية جديدة
  const form = useForm({
    initialValues: {
      name: '',
      academicYearsCount: 5,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'اسم الكلية قصير جدًا' : null),
      academicYearsCount: (value) => (value < 1 || value > 10 ? 'عدد السنوات يجب أن يكون بين 1 و 10' : null),
    },
  });

  // 3. إعداد الـ Mutation لإنشاء كلية
  const createMutation = useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      // عند النجاح: أعد جلب بيانات الكليات لتحديث الجدول
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      // أغلق النافذة وأعد تعيين النموذج
      setModalOpened(false);
      form.reset();
    },
    onError: (err: any) => {
      // يمكنك عرض رسالة خطأ هنا باستخدام نظام إشعارات Mantine لاحقًا
      console.error("Error creating college:", err);
      alert(`فشل إنشاء الكلية: ${err.response?.data?.message || err.message}`);
    }
  });

  // 4. عرض حالة التحميل أو الخطأ
  if (isLoading) return <Loader />;
  if (isError) return <Alert color="red" title="خطأ في جلب البيانات">{error.message}</Alert>;

  // 5. إنشاء صفوف الجدول
  const rows = colleges?.map((college) => (
    <Table.Tr key={college.id}>
      <Table.Td>{college.name}</Table.Td>
      <Table.Td>{college.academicYearsCount}</Table.Td>
      <Table.Td>
        {/* يمكنك إضافة أزرار التعديل والحذف هنا لاحقًا */}
        <Button size="xs" variant="light">تعديل</Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>إدارة الكليات</Title>
        <Button onClick={() => setModalOpened(true)}>إضافة كلية جديدة</Button>
      </Group>
      
      {colleges && colleges.length > 0 ? (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>اسم الكلية</Table.Th>
              <Table.Th>عدد السنوات الدراسية</Table.Th>
              <Table.Th>الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <Alert title="لا توجد كليات" color="blue">
          لم يتم إضافة أي كليات بعد. ابدأ بإضافة كلية جديدة.
        </Alert>
      )}

      {/* نافذة إنشاء كلية جديدة */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="إضافة كلية جديدة"
      >
        <form onSubmit={form.onSubmit((values) => createMutation.mutate(values))}>
          <Stack>
            <TextInput
              required
              label="اسم الكلية"
              placeholder="مثال: كلية الهندسة المعلوماتية"
              {...form.getInputProps('name')}
            />
            <NumberInput
              required
              label="عدد السنوات الدراسية"
              placeholder="مثال: 5"
              min={1}
              max={10}
              {...form.getInputProps('academicYearsCount')}
            />
            <Button type="submit" mt="md" loading={createMutation.isPending}>
              إنشاء الكلية
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}