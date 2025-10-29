'use client';

import {useTransition} from "react";
import {answerSchema, AnswerSchema} from "@/lib/schemas/answerSchema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {postAnswer} from "@/lib/actions/question-actions";
import {Answer} from "@/lib/types";
import {handleError} from "@/lib/util";
import RichTextEditor from "@/components/rte/RichTextEditor";
import {Button} from "@heroui/button";

type Props = {
    answer?: Answer;
    questionId: string
}

export default function AnswerForm({answer, questionId}: Props) {
    const [pending, startTransition] = useTransition();
    const {control, handleSubmit, reset, formState} = useForm<AnswerSchema>({
        mode: 'onTouched',
        resolver: zodResolver(answerSchema)
    });

    const onSubmit = (data: AnswerSchema) => {
        startTransition(async () => {
            const {error} = await postAnswer(data, questionId);
            if (error) handleError(error);
            reset();
        })
    }

    return (
        <div className="flex flex-col gap-3 items-start my-4 w-full px-6">
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
                <Button className='w-fit' disabled={!formState.isValid || pending} isLoading={pending} color='primary'
                        type='submit'>
                    Post your answer
                </Button>
            </form>
        </div>
    );
}