'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
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

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .refine(
      (password) => {
        //Valida se a senha tem pelo menos uma letra maiúscula e um caractere especial
        return /^(?=.*[!@#$%^&*])(?=.*[A-Z]).*$/.test(password);
      },
      {
        message:
          'A senha deve ter pelo menos uma letra maiúscula e um caractere especial',
      }
    ),
  acceptTerms: z
    .boolean({
      message: 'Você deve concordar com os termos e condições',
    })
    .refine((data) => data === true, {
      message: 'Você deve concordar com os termos e condições',
    }),
});

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  async function handleRegister(data: z.infer<typeof registerSchema>) {
    try {
      await api.post('/accounts', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message)
        alert(err?.response?.data?.message);
      return;
    }
    router.push('/log-in');
  }

  return (
    <>
      <Calendar1 size={50} />
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className='flex flex-col gap-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder='Digite seu nome' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <PasswordInput placeholder='••••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='acceptTerms'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        Eu concordo com os termos e condições
                      </FormLabel>
                      <FormDescription>
                        Ao criar uma conta, você concorda com nossos{' '}
                        <Link
                          href='/terms-and-conditions'
                          className='text-primary hover:underline'
                        >
                          termos e condições
                        </Link>
                        .
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit'>Registrar</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='justify-between'>
          <small>Já tem uma conta?</small>
          <Button size='sm' asChild>
            <Link href='/log-in'>Entrar</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
