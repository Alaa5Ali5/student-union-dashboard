// src/pages/ApplicationsPage.tsx
import { Title, Table, Loader, Alert, Badge, Card, Text, Group, Stack, Button, Modal, ScrollArea } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '../services/api';
import type { Application } from '../services/api';
import { useState } from 'react';
import { translateFieldName } from '../utils/fieldMapping';

export function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  // تنسيق التاريخ بالميلادي (تقويم Gregorian) مع عرض عربي
  const formatGregorianDate = (value: string | number | Date) => {
    return new Intl.DateTimeFormat('ar-SY-u-ca-gregory', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value));
  };

  // استخدام useQuery لجلب البيانات من الـ API
  const { data, isLoading, isError, error } = useQuery<Application[], Error>({
    queryKey: ['applications'],
    queryFn: getApplications,
  });

  // حالة التحميل
  if (isLoading) {
    return <Loader />;
  }

  // حالة الخطأ
  if (isError) {
    return <Alert color="red" title="حدث خطأ">
      {error.message || 'لم نتمكن من جلب البيانات. حاول مرة أخرى.'}
    </Alert>;
  }

  // إنشاء صفوف الجدول من البيانات
  const rows = data?.map((app) => {
    const statusColor = {
      pending: 'yellow',
      accepted: 'green',
      rejected: 'red',
    }[app.status];

    const statusText = {
      pending: 'قيد المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض',
    }[app.status];

    return (
      <Table.Tr key={app.id}>
        <Table.Td>{app.fullName}</Table.Td>
        <Table.Td>{app.phoneNumber}</Table.Td>
        <Table.Td>{app.college}</Table.Td>
        <Table.Td>{app.specialization}</Table.Td>
        <Table.Td>
          <Badge color={statusColor} variant="light">
            {statusText}
          </Badge>
        </Table.Td>
        <Table.Td>{formatGregorianDate(app.createdAt)}</Table.Td>
        <Table.Td>
          <Button 
            size="xs" 
            variant="light" 
            onClick={() => {
              setSelectedApplication(app);
              setModalOpened(true);
            }}
          >
            عرض التفاصيل
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Title order={2} mb="xl">طلبات الانضمام للفريق الإعلامي</Title>
      
      {data && data.length > 0 ? (
        <>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>الاسم الكامل</Table.Th>
                <Table.Th>رقم الهاتف</Table.Th>
                <Table.Th>الكلية</Table.Th>
                <Table.Th>التخصص</Table.Th>
                <Table.Th>الحالة</Table.Th>
                <Table.Th>تاريخ التقديم</Table.Th>
                <Table.Th>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>

          {/* نافذة عرض التفاصيل */}
          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title="تفاصيل طلب الانضمام"
            size="lg"
            scrollAreaComponent={ScrollArea.Autosize}
          >
            {selectedApplication && (
              <Stack gap="md">
                {/* المعلومات الشخصية */}
                <Card withBorder p="md">
                  <Title order={4} mb="md">المعلومات الشخصية</Title>
                  <Stack gap="sm">
                    <Group>
                      <Text fw={500}>الاسم الكامل:</Text>
                      <Text>{selectedApplication.fullName}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>رقم الهاتف:</Text>
                      <Text>{selectedApplication.phoneNumber}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>الكلية:</Text>
                      <Text>{selectedApplication.college}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>التخصص:</Text>
                      <Text>{selectedApplication.specialization}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>السنة الدراسية:</Text>
                      <Text>{selectedApplication.academicYear}</Text>
                    </Group>
                  </Stack>
                </Card>

                {/* المجالات الإعلامية */}
                <Card withBorder p="md">
                  <Title order={4} mb="md">المجالات الإعلامية المطلوبة</Title>
                  <Group>
                    {selectedApplication.interestedFields.map((field, index) => (
                      <Badge key={index} variant="light" color="blue">
                        {translateFieldName(field.name)}
                      </Badge>
                    ))}
                  </Group>
                </Card>

                {/* الخبرة السابقة */}
                <Card withBorder p="md">
                  <Title order={4} mb="md">الخبرة السابقة</Title>
                  <Group>
                    <Text fw={500}>هل لديك خبرة سابقة؟</Text>
                    <Badge color={selectedApplication.hasExperience ? 'green' : 'red'}>
                      {selectedApplication.hasExperience ? 'نعم' : 'لا'}
                    </Badge>
                  </Group>
                  {selectedApplication.hasExperience && selectedApplication.experienceDetails && (
                    <Text mt="sm" c="dimmed">
                      {selectedApplication.experienceDetails}
                    </Text>
                  )}
                </Card>

                {/* روابط الأعمال */}
                {selectedApplication.portfolioLinks && selectedApplication.portfolioLinks.length > 0 && (
                  <Card withBorder p="md">
                    <Title order={4} mb="md">أمثلة من الأعمال (Portfolio)</Title>
                    <Stack gap="sm">
                      {selectedApplication.portfolioLinks.map((link, index) => (
                        <Text key={index}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                            رابط {index + 1}
                          </a>
                        </Text>
                      ))}
                    </Stack>
                  </Card>
                )}

                {/* المعدات والبرامج */}
                {selectedApplication.equipmentDetails && (
                  <Card withBorder p="md">
                    <Title order={4} mb="md">المعدات والبرامج المتوفرة</Title>
                    <Text>{selectedApplication.equipmentDetails}</Text>
                  </Card>
                )}

                {/* سبب الانضمام */}
                <Card withBorder p="md">
                  <Title order={4} mb="md">سبب الانضمام للفريق الإعلامي</Title>
                  <Text>{selectedApplication.reasonToJoin}</Text>
                </Card>

                {/* معلومات إضافية */}
                <Card withBorder p="md">
                  <Title order={4} mb="md">معلومات إضافية</Title>
                  <Stack gap="sm">
                    <Group>
                      <Text fw={500}>الحالة:</Text>
                      <Badge color={
                        selectedApplication.status === 'pending' ? 'yellow' :
                        selectedApplication.status === 'accepted' ? 'green' : 'red'
                      }>
                        {selectedApplication.status === 'pending' ? 'قيد المراجعة' :
                         selectedApplication.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                      </Badge>
                    </Group>
                    <Group>
                      <Text fw={500}>تاريخ التقديم:</Text>
                      <Text>{formatGregorianDate(selectedApplication.createdAt)}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>آخر تحديث:</Text>
                      <Text>{formatGregorianDate(selectedApplication.updatedAt)}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
            )}
          </Modal>
        </>
      ) : (
        <Alert title="لا توجد طلبات" color="blue">
          لا يوجد أي طلبات انضمام مقدمة حتى الآن.
        </Alert>
      )}
    </>
  );
}