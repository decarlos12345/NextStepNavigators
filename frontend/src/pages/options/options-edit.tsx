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

import { update, fetch } from '../../stores/options/optionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditOptionsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'text': '',

    is_correct: false,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { options } = useAppSelector((state) => state.options)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof options === 'object') {
      setInitialValues(options)
    }
  }, [options])

  useEffect(() => {
      if (typeof options === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (options)[el])
          setInitialValues(newInitialVal);
      }
  }, [options])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/options/options-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit options')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit options'} main>
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
        label="Text"
    >
        <Field
            name="text"
            placeholder="Text"
        />
    </FormField>

    <FormField label='IsCorrect' labelFor='is_correct'>
        <Field
            name='is_correct'
            id='is_correct'
            component={SwitchField}
        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/options/options-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditOptionsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditOptionsPage
