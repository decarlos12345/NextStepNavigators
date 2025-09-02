import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/questions/questionsSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const QuestionsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { questions } = useAppSelector((state) => state.questions)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View questions')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View questions')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/questions/questions-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <FormField label='Multi Text' hasTextareaHeight>
                  <textarea className={'w-full'} disabled value={questions?.question_text} />
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Type</p>
                    <p>{questions?.type ?? 'No data'}</p>
                </div>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/questions/questions-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

QuestionsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default QuestionsView;
