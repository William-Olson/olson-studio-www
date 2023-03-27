import * as React from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import { CSSProperties } from 'react';
import { StudioApiUser } from '../../types/StudioApiTypes';
import TimePicker from './inputs/TimePicker';
import { UserAutocomplete } from './inputs/UserAutocomplete';
import { ChoreChartService } from '../../services/ChoreChartService';
import { Token } from '../../util/Auth';
import moment from 'moment';
import { ChoreChartPayload } from '../../types/ChoreTypes';
import { getToastTheme, Toast } from '../../util/Toast';
import { DarkModeState } from '../../stores/DarkModeStore';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../../stores/UserStore';
import { AdminGuard } from '../helpers/AdminGuard';
import { observer } from 'mobx-react';
import { emitter } from '../../Events';

interface FormValues {
  assignee?: string;
  name?: string;
  description?: string;
  dueTime?: string;
}

export const CreateChartComponent: React.FC<{}> = () => {
  const navigate = useNavigate();
  const initialValues: FormValues = {
    assignee: '',
    name: '',
    description: '',
    dueTime: '06:00 PM'
  };

  const formStyles: CSSProperties = {
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };
  const buttonClass = 'border-2 border-inherit rounded py-1 px-3 mt-11';
  const labelClass = 'block bg-inherit text-sm font-bold mb-2  mt-8';
  const inputClass =
    'shadow appearance-none border rounded w-full py-2 px-3 bg-inherit leading-tight focus:outline-none focus:shadow-outline';

  const validateAssigneeExists = async (userId?: string) => {
    let errorFound: string | undefined;
    if (!userId) {
      errorFound = 'Required';
    }

    // todo check if user exists in db via API call
    // if (!userFound) { errorFound = 'Assignee not found!'; }

    return errorFound;
  };

  const validateTime = async (timeValue?: string) => {
    let errorFound: string | undefined;
    if (!timeValue) {
      errorFound = 'Required';
    }

    // check the time is a valid value
    const isValidTime = moment(
      '2023-01-01 ' + timeValue,
      'YYYY-MM-DD LT',
      true // strict mode to catch errors
    ).isValid();

    if (!isValidTime) {
      errorFound = 'Invalid time!';
    }

    return errorFound;
  };

  const onSubmit = async (values: FormValues, actions: FormikHelpers<any>) => {
    console.log({ values, actions });
    // alert(JSON.stringify(values, null, 2));
    try {
      const api = new ChoreChartService();
      api.createChoreChart(Token.fromCache(), values as ChoreChartPayload);
      Toast.success('Created chart successfully', {
        theme: getToastTheme(DarkModeState.isDark)
      });
      navigate('/chore-charts');
      emitter.emit('chartsUpdated');
      // setTimeout(() => emitter.emit('chartsUpdated'), 1000);
    } catch (err) {
      console.error('Error creating chart');
      console.error(err);
    }
    actions.setSubmitting(false);
  };

  const userState: typeof UserState = UserState;
  if (!userState.isAdmin) {
    return <AdminGuard isAdmin={userState.isAdmin} />;
  }

  return (
    <div style={formStyles}>
      <div className="text-2xl font-mono pb-3">Create Chore Chart</div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ errors, touched }) => (
          <Form>
            <label htmlFor="name" className={labelClass}>
              Chart Name
            </label>
            <Field
              autoFocus={true}
              className={inputClass}
              id="name"
              required
              name="name"
              placeholder="Chart Name"
            />

            <label htmlFor="assignee" className={labelClass}>
              Assignee
            </label>
            <Field
              required
              validate={validateAssigneeExists}
              id="assignee"
              name="assignee"
              placeholder="Assignee"
            >
              {({ field }: FieldProps) => {
                return (
                  <UserAutocomplete
                    onSelect={(selected: StudioApiUser) =>
                      field.onChange({
                        target: { name: 'assignee', value: selected?.id }
                      })
                    }
                  />
                );
              }}
            </Field>
            {errors.assignee && touched.assignee && (
              <div className="text-accent font-medium">{errors.assignee}</div>
            )}

            <label htmlFor="description" className={labelClass}>
              Chart Description
            </label>
            <Field
              required
              className={inputClass}
              id="description"
              as="textarea"
              name="description"
              placeholder="Chart Description"
            />

            <label htmlFor="dueTime" className={labelClass}>
              Due At
            </label>
            <Field required validate={validateTime} id="dueTime" name="dueTime">
              {({ field }: FieldProps) => (
                <TimePicker
                  value={field.value}
                  onChange={(time?: string) => {
                    field.onChange({
                      target: { name: 'dueTime', value: time }
                    });
                  }}
                />
              )}
            </Field>
            {errors.dueTime && touched.dueTime && (
              <div className="text-accent font-medium">{errors.dueTime}</div>
            )}

            <button className={buttonClass} type="submit">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const CreateChartForm = observer(CreateChartComponent);
