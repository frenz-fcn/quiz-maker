import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Button,
  Modal,
  Text,
  TextInput,
  NumberInput,
  useCreateOverlay,
  useToast,
  Switch,
} from '../components';
import {
  type Quiz,
  type QuizDetailsPayload,
  quizDetailsSchema,
} from '../types';
import { useCreateQuizQuestionsModal } from '.';
import { cn } from '../utilities';

const useCreateQuizMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['CREATE_QUIZ'],
    mutationFn: (payload: Pick<QuizDetailsPayload, 'title' | 'description'>) =>
      axios.post('/quizzes', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['QUIZ_LIST'] });
    },
  });
};

const useUpdateQuizMutation = (quizId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['CREATE_QUIZ', quizId],
    mutationFn: (payload: Pick<QuizDetailsPayload, 'title' | 'description'>) =>
      axios.patch(`/quizzes/${quizId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['QUIZ_LIST'] });
    },
  });
};

type Props = {
  data?: Quiz;
  onClose: () => void;
};

const ViewAddUpdateQuizModal = ({ onClose, data }: Props) => {
  const { toast } = useToast();
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 0,
      isPublished: false,
    },
    resolver: zodResolver(
      quizDetailsSchema.pick({
        title: true,
        description: true,
        timeLimitSeconds: true,
        isPublished: true,
      })
    ),
  });
  const [title, description, timeLimitSeconds] = watch([
    'title',
    'description',
    'timeLimitSeconds',
  ]);
  const { mutate: createQuiz, isPending: isCreating } = useCreateQuizMutation();
  const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuizMutation(
    data?.id ?? undefined
  );
  const openCreateQuizQuestionsModal = useCreateQuizQuestionsModal();

  const isPending = isCreating || isUpdating;

  const handleOnSubmit = useCallback(
    (form: Pick<QuizDetailsPayload, 'title' | 'description'>) => {
      if (data?.id)
        return updateQuiz(form, {
          onSuccess: () => {
            toast({
              title: 'Success!',
              message: 'Quiz details updated successfully',
              intent: 'success',
              filled: true,
            });
          },
        });
      createQuiz(form, {
        onSuccess: (res) => {
          onClose();
          openCreateQuizQuestionsModal(data?.id ?? res?.data?.id);
        },
      });
    },
    [data, onClose, createQuiz, updateQuiz, openCreateQuizQuestionsModal]
  );

  useEffect(() => {
    reset({
      ...data,
      timeLimitSeconds: data?.timeLimitSeconds ?? 0,
      isPublished: !!data?.isPublished,
    });
  }, [data, reset]);

  return (
    <Modal
      size="lg"
      intent="primary"
      title={
        <div className="flex flex-col max-w-">
          <Text as="h1" size="lead" weight="semibold">
            {data?.title ? data.title : 'Untitled'}
          </Text>
          <Text as="p" size="body" color="subtle">
            {data?.description ? data.description : 'Create new quiz'}
          </Text>
        </div>
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <TextInput
          label="Title"
          value={title}
          onChange={(v) => setValue('title', v)}
          placeholder="Enter title"
          error={errors.title?.message}
        />
        <TextInput
          label="Description"
          value={description}
          onChange={(v) => setValue('description', v)}
          placeholder="Enter description"
          error={errors.description?.message}
        />
        <div className="flex items-center w-full justify-between">
          <div>
            <NumberInput
              showControls
              label="Time limit seconds"
              value={Number(timeLimitSeconds)}
              onChange={(v) => setValue('timeLimitSeconds', String(v))}
              error={errors.timeLimitSeconds?.message}
            />
          </div>
          <div>
            <Switch
              title="Publish?"
              id="isPublished"
              value={watch('isPublished')}
              onChange={(v) => setValue('isPublished', v)}
            />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center',
            data?.id ? 'justify-between' : 'justify-end space-x-2'
          )}
        >
          {!data?.id ? (
            <Button type="submit" intent="primary" disabled={isPending}>
              Next
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                intent="primary"
                onClick={() => {
                  openCreateQuizQuestionsModal(data?.id);
                  onClose();
                }}
              >
                Go to Questions
              </Button>
              <Button type="submit" intent="primary" disabled={isPending}>
                Update
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

const useViewAddUpdateQuizModal = () => {
  const createModal = useCreateOverlay(undefined);
  const openViewAddUpdateQuizModal = useCallback(
    (data?: Quiz) => {
      createModal({
        component: ({ close }) => (
          <ViewAddUpdateQuizModal onClose={close} data={data} />
        ),
      });
    },
    [createModal]
  );
  return openViewAddUpdateQuizModal;
};

export default useViewAddUpdateQuizModal;
