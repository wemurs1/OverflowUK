'use client';

import {useRef, useTransition} from "react";
import {answerSchema, AnswerSchema} from "@/lib/schemas/answerSchema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {postAnswer, updateAnswer} from "@/lib/actions/question-actions";
import {handleError} from "@/lib/util";
import RichTextEditor from "@/components/rte/RichTextEditor";
import {Button} from "@heroui/button";
import {useAnswerStore} from "@/lib/hooks/useAnswerStore";

type Props = {
    questionId: string
}

export default function AnswerForm({questionId}: Props) {
    const [pending, startTransition] = useTransition();
    const editableAnswer = useAnswerStore(state => state.answer);
    const clearAnswer = useAnswerStore(state => state.clearAnswer);
    const {control, handleSubmit, reset, formState} = useForm<AnswerSchema>({
        mode: 'onTouched',
        resolver: zodResolver(answerSchema),
        values: {
            content: editableAnswer?.content
        }
    });

    const onSubmit = (data: AnswerSchema) => {
        startTransition(async () => {
            if (editableAnswer) {
                const {error} = await updateAnswer(editableAnswer.id, editableAnswer.questionId, data);
                if (error) handleError(error);
                clearAnswer();
                reset();
            } else {
                const {error} = await postAnswer(data, questionId);
                if (error) handleError(error);
                reset();
            }
        })
    }

    return (
        <div id={'answer-form'} className="flex flex-col gap-3 items-start my-4 w-full px-6">
            <h3 className='text-2xl'>Your answer</h3>
            <form className='w-full flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name={'content'}
                    render={({field: {onChange, onBlur, value}, fieldState}) => (
                        <>
                            <RichTextEditor
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value || ''}
                                errorMessage={fieldState.error?.message}
                            />
                            {fieldState.error?.message && (
                                <span className='text-xs text-danger -mt-1'>{fieldState.error.message}</span>
                            )}
                        </>
                    )}/>
                <div className="flex items-start gap-3 mb-6">
                    <Button className='w-fit' disabled={!formState.isValid || pending} isLoading={pending}
                            color='primary'
                            type='submit'>
                        {editableAnswer ? 'Update' : 'Post'} your answer
                    </Button>
                    <Button
                        isDisabled={!editableAnswer}
                        onPress={() => {
                            clearAnswer();
                            reset();
                        }}
                        className='w-fit'
                        type='button'
                    >
                        Cancel
                    </Button></div>
            </form>
        </div>
    );
}