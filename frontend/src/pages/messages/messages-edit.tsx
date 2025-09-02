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

import { update, fetch } from '../../stores/messages/messagesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditMessagesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'subject': '',

    body: '',

    sent_by: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { messages } = useAppSelector((state) => state.messages)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof messages === 'object') {
      setInitialValues(messages)
    }
  }, [messages])

  useEffect(() => {
      if (typeof messages === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (messages)[el])
          setInitialValues(newInitialVal);
      }
  }, [messages])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/messages/messages-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit messages')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit messages'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Subject"
    >
        <Field
            name="subject"
            placeholder="Subject"
        />
    </FormField>

    <FormField label="Body" hasTextareaHeight>
        <Field name="body" as="textarea" placeholder="Body" />
    </FormField>

  <FormField label='SentBy' labelFor='sent_by'>
        <Field
            name='sent_by'
            id='sent_by'
            component={SelectField}
            options={initialValues.sent_by}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/messages/messages-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditMessagesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditMessagesPage
