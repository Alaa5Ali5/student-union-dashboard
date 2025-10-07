import { useForm } from '@mantine/form';
import { TextInput, Button, Paper, Title, Stack, Alert } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/api';

// تعريف أنواع البيانات
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: any;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function LoginPage() {
  // استخدام useMutation لإدارة حالة تسجيل الدخول
  const mutation = useMutation<LoginResponse, ApiError, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      // عند النجاح، قم بتخزين التوكن وتوجيه المستخدم
      localStorage.setItem('authToken', data.token);
      // window.location.href = '/'; // توجيه بسيط للمستخدم
      window.location.href = '/'; 
    },
  });

  // استخدام useForm الخاص بـ Mantine، فهو بسيط وممتاز
  const form = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'البريد الإلكتروني غير صحيح'),
      password: (value: string) => (value.length < 8 ? 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل' : null),
    },
  });

  return (
    <Stack align="center" justify="center" style={{ height: '100vh' }}>
      <Paper withBorder shadow="md" p={30} radius="md" style={{ minWidth: 400 }}>
        <Title ta="center" order={2} mb="xl">
          تسجيل الدخول
        </Title>
        
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <TextInput
              required
              label="البريد الإلكتروني"
              placeholder="admin@example.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              required
              label="كلمة المرور"
              placeholder="********"
              type="password"
              {...form.getInputProps('password')}
            />
            
            {mutation.isError && (
              <Alert color="red" title="خطأ في تسجيل الدخول">
                {(mutation.error as ApiError)?.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'}
              </Alert>
            )}
            
            <Button type="submit" fullWidth mt="xl" loading={mutation.isPending}>
              دخول
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}