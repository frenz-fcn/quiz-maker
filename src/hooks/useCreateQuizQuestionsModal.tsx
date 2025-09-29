import { useCallback, useEffect, useState } from 'react';
import z from 'zod';
import { HiChevronRight, HiPlus } from 'react-icons/hi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  Button,
  Modal,
  SelectInput,
  Text,
  TextInput,
  useCreateOverlay,
  CodeBlock,
  NumberInput,
} from '../components';
import { quizQuestionsSchema, type QuizQuestionsPayload } from '../types';
import {
  useQuizDataQuery,
  useCreateQuizQuestionsMutation,
  useUpdateQuizQuestionsMutation,
  useRemoveQuizQuestionsMutation,
} from '.';

type Props = {
  onClose: () => void;
  quizId?: number;
};

type QuizQuestionType = 'short' | 'mcq' | 'code';

const CreateQuizQuestionModal = ({ onClose, quizId }: Props) => {
  const { data } = useQuizDataQuery(quizId ?? undefined);
  const {
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      questions: [
        {
          correctAnswer: '',
          id: undefined,
          options: ['-', '-', '-', '-'],
          position: undefined,
          prompt: '',
          quizId: quizId,
          type: 'short',
        },
      ],
    },
    resolver: zodResolver(
      z.object({
        questions: z.array(quizQuestionsSchema),
      })
    ),
  });
  const watchQuestions = watch('questions');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
    keyName: 'questionId',
  });
  const { mutate: createQuizQuestions, isPending: isCreating } =
    useCreateQuizQuestionsMutation(quizId ?? 0);
  const { mutate: updateQuizQuestions, isPending: isUpdating } =
    useUpdateQuizQuestionsMutation(quizId ?? 0);
  const { mutate: removeQuizQuestions, isPending: isRemoving } =
    useRemoveQuizQuestionsMutation(quizId ?? 0);

  const [newPos, setNewPos] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>();
  const createModal = useCreateOverlay({
    newPos,
    setNewPos,
    updateQuizQuestions,
  });

  const isPending = isCreating || isRemoving || isUpdating;

  const changeQuestionOrder = useCallback(
    (data: QuizQuestionsPayload) => {
      createModal({
        component: ({
          close,
          state: { newPos, setNewPos, updateQuizQuestions },
        }) => (
          <Modal
            size="sm"
            intent="primary"
            onClose={close}
            title="Change Question Order"
            primaryAction={{
              label: 'Change',
              onClick: () =>
                updateQuizQuestions(
                  {
                    ...data,
                    position: Number(newPos) - 1,
                  },
                  {
                    onSuccess: close,
                  }
                ),
            }}
          >
            <NumberInput
              label="New Position"
              onChange={setNewPos}
              value={newPos}
            />
          </Modal>
        ),
      });
    },
    [createModal]
  );

  const hasError = useCallback(
    (index: number): boolean => {
      if (watchQuestions[index].prompt === '') {
        setError(`questions.${index}.prompt`, {
          message: 'Required',
        });
      }
      if (watchQuestions[index].correctAnswer === '') {
        setError(`questions.${index}.correctAnswer`, {
          message: 'Required',
        });
      }
      if (
        watchQuestions[index].type === 'mcq' &&
        watchQuestions[index].options.some((o) => o === '')
      ) {
        setError(`questions.${index}.options`, {
          message: 'Required',
        });
      }

      if (
        watchQuestions[index].prompt !== '' &&
        watchQuestions[index].correctAnswer !== ''
      ) {
        clearErrors([
          `questions.${index}.prompt`,
          `questions.${index}.correctAnswer`,
        ]);
      }
      if (
        watchQuestions[index].type === 'mcq' &&
        watchQuestions[index].options.some((o) => o !== '')
      ) {
        clearErrors(`questions.${index}.options`);
      }

      return (
        watchQuestions[index].prompt === '' ||
        watchQuestions[index].correctAnswer === '' ||
        (watchQuestions[index].type === 'mcq'
          ? watchQuestions[index].options.some((o) => o === '')
          : false)
      );
    },
    [watchQuestions]
  );

  useEffect(() => {
    if (data)
      reset({
        questions: data?.questions,
      });
  }, [reset, data]);

  return (
    <Modal
      size="2xl"
      intent="primary"
      title={
        <div className="flex flex-col">
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
      <div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {fields.map((field, index) => (
            <div
              key={field.questionId}
              className="p-4 border border-subtle rounded-md flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-brand"
                    onClick={() =>
                      setIsExpanded({
                        ...isExpanded,
                        [field.questionId]: !isExpanded?.[field.questionId],
                      })
                    }
                  >
                    <HiChevronRight
                      size={24}
                      className={
                        isExpanded?.[field.questionId] ? 'rotate-90' : ''
                      }
                    />
                  </button>
                  <Text size="lead" weight="semibold">
                    Question {index + 1}
                  </Text>
                </div>
                <Button
                  intent="primary"
                  variant="text"
                  type="button"
                  size="sm"
                  onClick={() => {
                    setNewPos(Number(field.position) + 1);
                    changeQuestionOrder(field);
                  }}
                >
                  Change Order
                </Button>
              </div>
              {isExpanded?.[field.questionId] && (
                <>
                  <TextInput
                    label="Prompt"
                    value={watchQuestions[index].prompt}
                    onChange={(v) => setValue(`questions.${index}.prompt`, v)}
                    error={errors.questions?.[index]?.prompt?.message}
                    placeholder="Enter prompt"
                    className="mt-4"
                  />
                  <SelectInput
                    label="Type"
                    value={{
                      label: watchQuestions[index].type?.toUpperCase(),
                      value: watchQuestions[index].type,
                    }}
                    onChange={(v) => {
                      setValue(
                        `questions.${index}.type`,
                        v?.value as QuizQuestionType
                      );
                      if (v.value === 'mcq') {
                        setValue(`questions.${index}.options`, [
                          '',
                          '',
                          '',
                          '',
                        ]);
                        return;
                      }
                      if (v.value === 'code') {
                        setValue(`questions.${index}.correctAnswer`, '');
                        return;
                      }
                      if (v.value === 'short') {
                        setValue(`questions.${index}.correctAnswer`, '');
                        return;
                      }
                    }}
                    options={[
                      { label: 'Short', value: 'short' },
                      { label: 'MCQ', value: 'mcq' },
                      { label: 'Code', value: 'code' },
                    ]}
                    error={errors.questions?.[index]?.type?.message}
                    placeholder="Select type"
                  />
                  {watchQuestions[index]?.type === 'mcq' && (
                    <div className="grid grid-cols-4 gap-2">
                      <TextInput
                        label="Option 1"
                        value={watchQuestions[index].options?.[0]}
                        onChange={(v) =>
                          setValue(`questions.${index}.options.${0}`, v)
                        }
                        error={errors.questions?.[index]?.options?.message}
                      />
                      <TextInput
                        label="Option 2"
                        value={watchQuestions[index].options?.[1]}
                        onChange={(v) =>
                          setValue(`questions.${index}.options.${1}`, v)
                        }
                        error={errors.questions?.[index]?.options?.message}
                      />
                      <TextInput
                        label="Option 3"
                        value={watchQuestions[index].options?.[2]}
                        onChange={(v) =>
                          setValue(`questions.${index}.options.${2}`, v)
                        }
                        error={errors.questions?.[index]?.options?.message}
                      />
                      <TextInput
                        label="Option 4"
                        value={watchQuestions[index].options?.[3]}
                        onChange={(v) =>
                          setValue(`questions.${index}.options.${3}`, v)
                        }
                        error={errors.questions?.[index]?.options?.message}
                      />
                    </div>
                  )}
                  {watchQuestions[index]?.type === 'code' && (
                    <CodeBlock
                      language="javascript"
                      label="Correct Answer"
                      initialCode={watchQuestions[
                        index
                      ].correctAnswer?.toString()}
                      onChange={(v) =>
                        setValue(`questions.${index}.correctAnswer`, v)
                      }
                      error={errors.questions?.[index]?.correctAnswer?.message}
                    />
                  )}
                  {watchQuestions[index].type !== 'code' && (
                    <TextInput
                      label="Correct Answer"
                      value={watchQuestions[index].correctAnswer?.toString()}
                      onChange={(v) =>
                        setValue(`questions.${index}.correctAnswer`, v)
                      }
                      placeholder="Enter correct answer"
                      error={errors.questions?.[index]?.correctAnswer?.message}
                    />
                  )}
                  <div className="flex items-center justify-end space-x-1">
                    {index !== 0 ? (
                      <Button
                        type="button"
                        intent="danger"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          !fields[index]?.id
                            ? remove(index)
                            : removeQuizQuestions(fields[index]?.id)
                        }
                      >
                        Remove
                      </Button>
                    ) : null}
                    {!fields[index]?.id ? (
                      <Button
                        intent="primary"
                        type="button"
                        onClick={() => {
                          if (hasError(index)) return;
                          createQuizQuestions(watchQuestions[index]);
                        }}
                        size="sm"
                        disabled={isPending}
                      >
                        Add
                      </Button>
                    ) : (
                      <Button
                        intent="primary"
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (hasError(index)) return;
                          updateQuizQuestions(watchQuestions[index]);
                        }}
                        size="sm"
                        disabled={isPending}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          {fields?.length !== 5 ? (
            <div className="p-4 border-brand border-4 border-dashed rounded-md flex flex-col relative">
              <div className="absolute inset-0 bg-brand-100/50 z-[1]">
                <div className="flex items-center justify-center h-full">
                  <Button
                    leadingIcon={HiPlus}
                    onClick={() =>
                      append({
                        correctAnswer: '',
                        id: undefined,
                        options: [],
                        position: undefined,
                        prompt: '',
                        quizId: quizId,
                        type: 'short',
                      })
                    }
                    intent="primary"
                  >
                    Add Question
                  </Button>
                </div>
              </div>
              <Text size="lead" weight="semibold">
                Question
              </Text>
              <TextInput
                label="Prompt"
                placeholder="Enter prompt"
                onChange={() => {}}
                value=""
                disabled
              />
              <SelectInput
                label="Type"
                placeholder="Select type"
                options={[
                  { label: 'Short', value: 'short' },
                  { label: 'MCQ', value: 'mcq' },
                  { label: 'Code', value: 'code' },
                ]}
                onChange={() => {}}
                value={null}
                disabled
              />
              <TextInput
                label="Correct Answer"
                placeholder="Enter correct answer"
                value=""
                onChange={() => {}}
                disabled
              />
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const useCreateQuizQuestionsModal = () => {
  const createModal = useCreateOverlay(undefined);
  const openCreateQuizQuestionModal = useCallback(
    (quizId?: number) => {
      createModal({
        component: ({ close }) => (
          <CreateQuizQuestionModal onClose={close} quizId={quizId} />
        ),
      });
    },
    [createModal]
  );

  return openCreateQuizQuestionModal;
};

export default useCreateQuizQuestionsModal;
