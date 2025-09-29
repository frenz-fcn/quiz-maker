import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { useQuizDataQuery, type Result } from '../../hooks';
import type { AntiCheatEvent } from '../../hooks/useAntiCheatContext';
import { Badge, Button, CodeBlock, Table, Text } from '../../components';

const QuizResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const result = state as Result & {
    quizId: number;
    antiCheat: {
      switches: number;
      pastes: number;
      events: AntiCheatEvent[];
    };
  };
  const { data: quizData } = useQuizDataQuery(result.quizId);

  const questions = quizData?.questions;
  const qResults = result?.details;

  const questionResults = useMemo(() => {
    const formattedResults = questions?.map((q) => {
      const detail = qResults.find((d) => d.questionId === q.id);
      return {
        ...q,
        ...detail,
      };
    });
    return formattedResults;
  }, [questions, qResults]);
  const totalQuestions =
    questions?.filter((q) => q.type !== 'code').length ?? 0;

  return (
    <div className="min-h-screen bg-interface-subtle flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mb-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <Text as="h1" size="title" weight="bold" className="mb-1">
              {quizData?.title ?? 'Quiz Result'}
            </Text>
            <Text color="subtle">{quizData?.description}</Text>
          </div>
          <div className="flex gap-4 items-end">
            <Text as="span" size="display" weight="bold">
              {result.score}
            </Text>
            <Text size="lead" className="mb-2">
              / {totalQuestions}
            </Text>
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {questionResults?.map((res) => (
          <div
            key={`result-${res.questionId}`}
            className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-3 border-brand border-l-4"
          >
            <div className="flex items-start justify-between gap-4">
              <Text
                as="h2"
                size="body-large"
                weight="semibold"
                className="flex-1"
              >
                {res.prompt}
              </Text>
              {res.type !== 'code' && (
                <Badge
                  label={res.correct ? 'Correct' : 'Incorrect'}
                  intent={res.correct ? 'success' : 'danger'}
                />
              )}
            </div>

            {res.type === 'code' ? (
              <CodeBlock
                readOnly
                onChange={() => {}}
                language="javascript"
                initialCode={res.correctAnswer?.toString()}
              />
            ) : (
              !res.correct && (
                <Text>
                  Expected answer:{' '}
                  <span className="font-semibold">{res.expected}</span>
                </Text>
              )
            )}
          </div>
        ))}
        <div className="w-full flex justify-center pt-6">
          <Button intent="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
        {result.antiCheat.events.length > 0 && (
          <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-6">
            <Text as="h2" size="subheading" weight="semibold">
              Anti-Cheat Summary
            </Text>
            <Table data={result.antiCheat.events}>
              {({ Column }) => (
                <>
                  <Column
                    label="Event"
                    name="type"
                    render={({ type }) => (
                      <>{type === 'switch' ? 'Tab Switch' : 'Paste'}</>
                    )}
                  />
                  <Column
                    label="Time"
                    name="timestamp"
                    render={({ timestamp }) =>
                      dayjs(timestamp).format('hh:mm:ss A')
                    }
                  />
                </>
              )}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
