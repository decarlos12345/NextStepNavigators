import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/questions/questionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditQuestionsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    question_text: '',

    type: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { questions } = useAppSelector((state) => state.questions)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof questions === 'object') {
      setInitialValues(questions)
    }
  }, [questions])

  useEffect(() => {
      if (typeof questions === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (questions)[el])
          setInitialValues(newInitialVal);
      }
  }, [questions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/questions/questions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit questions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit questions'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label="QuestionText" hasTextareaHeight>
        <Field name="question_text" as="textarea" placeholder="QuestionText" />
    </FormField>

    <FormField label="Type" labelFor="type">
        <Field name="type" id="type" component="select">

            <option value="multiple_choice">multiple_choice</option>

            <option value="true_false">true_false</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/questions/questions-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditQuestionsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditQuestionsPage
