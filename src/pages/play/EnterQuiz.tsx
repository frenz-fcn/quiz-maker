import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, useToast } from '../../components';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Attempt } from '../../types';
import { useAntiCheatContext } from '../../hooks';
import { useEffect } from 'react';

const quizIdSchema = z.object({
  quizId: z
    .string()
    .min(1, 'Quiz ID is required')
    .regex(/^\d+$/, 'Quiz ID must contain only numbers'),
});

type Payload = z.infer<typeof quizIdSchema>;

const useStartAttempt = () => {
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['START_ATTEMPT'],
    mutationFn: (quizId: string) =>
      axios.post<Attempt>('/attempts', {
        quizId,
      }),
    onError: () =>
      toast({
        title: 'Something went wrong!',
        message: 'Quiz not found!',
        intent: 'danger',
        filled: true,
      }),
  });
};

const EnterQuiz = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(quizIdSchema),
    defaultValues: {
      quizId: '',
    },
  });
  const watchedQuizId = watch('quizId');

  const { mutate: startAttempt, isPending } = useStartAttempt();

  const handleInputChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setValue('quizId', value, { shouldValidate: true });
    }
  };

  const handleOnSubmit = (form: Payload) => {
    startAttempt(form.quizId, {
      onSuccess: (res) => {
        navigate('/play/introduction', {
          state: res.data,
        });
      },
    });
  };

  const { setEvents } = useAntiCheatContext();

  useEffect(() => setEvents([]), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col items-center gap-6 bg-white rounded-md shadow-lg p-8 mt-2 w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-2">
          <Text as="h1" size="heading" color="brand" weight="bold">
            Enter Quiz
          </Text>
          <Text size="body" color="subtle" className="text-center">
            Please enter your quiz ID to get started
          </Text>
        </div>
        <div className="flex flex-col w-full">
          <TextInput
            name="quizId"
            value={watchedQuizId}
            onChange={handleInputChange}
            placeholder="Enter quiz ID"
            error={errors.quizId?.message}
          />
          <Button
            type="submit"
            intent="primary"
            size="lg"
            fullWidth
            disabled={!isValid || isPending}
          >
            Enter Quiz
          </Button>
          <Button
            variant="text"
            size="lg"
            fullWidth
            onClick={() => navigate('/')}
            className="mt-2"
          >
            Back
          </Button>
        </div>
        <Text size="caption" color="subtle" className="text-center">
          Quiz IDs contain only numbers only
        </Text>
      </form>
    </div>
  );
};

export default EnterQuiz;
