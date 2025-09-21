'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Calendar1 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export default function LogInPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleLogin(data: z.infer<typeof loginSchema>) {
    try {
      const response = await api.post('/sessions', {
        email: data.email,
        password: data.password,
      });

      // Store the token in localStorage
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
      }
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        form.setError('root', {
          type: 'manual',
          message: err.response.data.message,
        });
      } else {
        form.setError('root', {
          type: 'manual',
          message: 'Erro ao fazer login. Tente novamente.',
        });
      }
      return;
    }
    router.push('/home');
  }

  return (
    <>
      <Calendar1 size={50} />
      <Card className='w-full max-w-sm allig'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className='flex flex-col gap-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Digite seu email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Digite sua senha'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className='text-sm text-destructive text-center'>
                  {form.formState.errors.root.message}
                </div>
              )}
              <Button type='submit'>Entrar</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='justify-between'>
          <small>Não tem uma conta?</small>
          <Button size='sm' className='cursor-pointer'>
            <Link href='/sign-up' className='--color-foreground font-semibold'>
              Registrar
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
