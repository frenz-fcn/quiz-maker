import { z } from 'zod';
import { useEffect } from 'react';
import axios, { type AxiosError } from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const queryClient = new QueryClient();

axios.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_APP_TOKEN}`;
  return config;
});

const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  error_description: z.string(),
});

type ErrorResponse = z.infer<typeof errorResponseSchema>;

type Props = {
  children: React.ReactNode;
};

const QueryProvider = ({ children }: Props) => {
  useEffect(() => {
    axios.interceptors.response.use(
      (config) => {
        config.headers.Authorization = `Bearer ${import.meta.env.VITE_APP_TOKEN}`;
        return config;
      },
      (err: AxiosError<ErrorResponse>) => {
        throw new Error(err?.response?.data?.error, {
          cause: err?.response?.data?.error,
        });
      }
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
