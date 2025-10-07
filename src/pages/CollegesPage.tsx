// src/pages/CollegesPage.tsx
import { useState } from 'react';
import { Title, Table, Loader, Alert, Button, Group, Modal, Stack, TextInput, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getColleges, createCollege, updateCollege, deleteCollege, type College } from '../services/api';

export function CollegesPage() {
  const [modalOpened, setModalOpened] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
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

  // 3. إعداد الـ Mutation لإنشاء/تعديل كلية
  const saveMutation = useMutation({
    mutationFn: (values: { name: string; academicYearsCount: number }) => {
      if (editingCollege) {
        return updateCollege(editingCollege.id, values);
      }
      return createCollege(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      setModalOpened(false);
      setEditingCollege(null);
      form.reset();
    },
    onError: (err: any) => {
      console.error("Error saving college:", err);
      alert(`فشل حفظ الكلية: ${err.response?.data?.message || err.message}`);
    }
  });

  // 4. إعداد الـ Mutation للحذف
  const deleteMutation = useMutation({
    mutationFn: deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
    onError: (err: any) => {
      console.error("Error deleting college:", err);
      alert(`فشل حذف الكلية: ${err.response?.data?.message || err.message}`);
    }
  });

  // دالة لفتح نافذة التعديل
  const handleEdit = (college: College) => {
    setEditingCollege(college);
    form.setValues({
      name: college.name,
      academicYearsCount: college.academicYearsCount,
    });
    setModalOpened(true);
  };

  // دالة لإغلاق النافذة
  const handleClose = () => {
    setModalOpened(false);
    setEditingCollege(null);
    form.reset();
  };

  // دالة للحذف مع تأكيد
  const handleDelete = (college: College) => {
    if (window.confirm(`هل أنت متأكد من حذف "${college.name}"؟`)) {
      deleteMutation.mutate(college.id);
    }
  };

  // 4. عرض حالة التحميل أو الخطأ
  if (isLoading) return <Loader />;
  if (isError) return <Alert color="red" title="خطأ في جلب البيانات">{error.message}</Alert>;

  // 5. إنشاء صفوف الجدول
  const rows = colleges?.map((college) => (
    <Table.Tr key={college.id}>
      <Table.Td>{college.name}</Table.Td>
      <Table.Td>{college.academicYearsCount}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Button 
            size="xs" 
            variant="light" 
            color="blue"
            onClick={() => handleEdit(college)}
          >
            تعديل
          </Button>
          <Button 
            size="xs" 
            variant="light" 
            color="red"
            onClick={() => handleDelete(college)}
            loading={deleteMutation.isPending}
          >
            حذف
          </Button>
        </Group>
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

      {/* نافذة إنشاء/تعديل كلية */}
      <Modal
        opened={modalOpened}
        onClose={handleClose}
        title={editingCollege ? "تعديل الكلية" : "إضافة كلية جديدة"}
      >
        <form onSubmit={form.onSubmit((values) => saveMutation.mutate(values))}>
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
            <Button type="submit" mt="md" loading={saveMutation.isPending}>
              {editingCollege ? "حفظ التعديلات" : "إنشاء الكلية"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}