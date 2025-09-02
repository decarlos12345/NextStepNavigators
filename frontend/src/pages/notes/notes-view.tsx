import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/notes/notesSlice'
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

const NotesView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { notes } = useAppSelector((state) => state.notes)

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
              <title>{getPageTitle('View notes')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View notes')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/notes/notes-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Title</p>
                    <p>{notes?.title}</p>
                </div>

                <div className={'mb-4'}>
                  <p className={'block font-bold mb-2'}>Content</p>
                  {notes.content
                    ? <p dangerouslySetInnerHTML={{__html: notes.content}}/>
                    : <p>No data</p>
                  }
                </div>

                <FormField label='IsPublic'>
                    <SwitchField
                      field={{name: 'is_public', value: notes?.is_public}}
                      form={{setFieldValue: () => null}}
                      disabled
                    />
                </FormField>

                <FormField label='Reminder'>
                    {notes.reminder ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={notes.reminder ?
                        new Date(
                          dayjs(notes.reminder).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No Reminder</p>}
                </FormField>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/notes/notes-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

NotesView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default NotesView;
