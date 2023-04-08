import * as React from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import { CSSProperties, useEffect } from 'react';
import { ChoreChartService } from '../../services/ChoreChartService';
import { getToastTheme, Toast } from '../../util/Toast';
import { DarkModeState } from '../../stores/DarkModeStore';
import { useNavigate, useParams } from 'react-router-dom';
import { UserState } from '../../stores/UserStore';
import { AdminGuard } from '../helpers/AdminGuard';
import { observer } from 'mobx-react';
import { WeekdaysPicker } from './inputs/WeekdaysPicker';
import { Token } from '../../util/Auth';
import { ChorePayload } from '../../types/ChoreTypes';
import { AdminChartsState } from '../../stores/AdminChartsStore';
import { AdminChoresState } from '../../stores/AdminChoresStore';

interface FormValues {
  name?: string;
  description?: string;
  scheduleDays?: string;
}

interface CreateChoreComponentProps {}

export const CreateChoreComponent: React.FC<CreateChoreComponentProps> = () => {
  const navigate = useNavigate();
  const initialValues: FormValues = {
    name: '',
    description: '',
    scheduleDays: ''
  };

  const adminCharts: typeof AdminChartsState = AdminChartsState;
  const adminChores: typeof AdminChoresState = AdminChoresState;

  const { id } = useParams();

  useEffect(() => {
    adminCharts.findChart(id || '').then((c) => adminCharts.viewChart(c));
  });

  const formStyles: CSSProperties = {
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '10px',
    paddingRight: '10px'
  };
  const buttonClass = 'border-2 border-inherit rounded py-1 px-3 mt-11';
  const labelClass = 'block bg-inherit text-sm font-bold mb-2  mt-8';
  const inputClass =
    'shadow appearance-none border rounded w-full py-2 px-3 bg-inherit leading-tight focus:outline-none focus:shadow-outline';

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    // console.log({ values, actions });
    try {
      const api = new ChoreChartService();
      if (
        !(await api.createChore(
          Token.fromCache(),
          adminCharts.viewingChart?.id || '',
          values as ChorePayload
        ))
      ) {
        throw new Error(`Unable to create chart: ${values.name}`);
      }

      Toast.success('Created chore successfully', {
        theme: getToastTheme(DarkModeState.isDark)
      });
      navigate(`/admin/chore-charts/${adminCharts.viewingChart?.id}`);
      adminChores.fetchChores(adminCharts.viewingChart?.id);
    } catch (err) {
      console.error('Error creating chore');
      Toast.error((err as Error)?.message || 'Unable to create Chore!', {
        theme: getToastTheme(DarkModeState.isDark)
      });
      if (values.scheduleDays === '' || values.scheduleDays === undefined) {
        Toast.error('Missing: Days Due on', {
          theme: getToastTheme(DarkModeState.isDark)
        });
      }
      // console.error(err);
    }
    actions.setSubmitting(false);
  };

  const userState: typeof UserState = UserState;
  if (!userState.isAdmin) {
    return <AdminGuard isAdmin={userState.isAdmin} />;
  }

  return (
    <div style={formStyles}>
      <div className="text-2xl font-mono pb-3">Create Chore</div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ errors, touched }) => (
          <Form>
            <label htmlFor="name" className={labelClass}>
              Chore Name
            </label>
            <Field
              autoFocus={true}
              className={inputClass}
              id="name"
              required
              name="name"
              placeholder="Chore Name"
            />

            <label htmlFor="description" className={labelClass}>
              Chore Description
            </label>
            <Field
              required
              className={inputClass}
              id="description"
              as="textarea"
              name="description"
              placeholder="Chore Description"
            />

            <label htmlFor="weekdays" className={labelClass}>
              Days Due On
            </label>
            <Field required id="weekdays" name="weekdays">
              {({ field }: FieldProps) => (
                <WeekdaysPicker
                  value={field.value}
                  onChange={(days: string) => {
                    field.onChange({
                      target: { name: 'scheduleDays', value: `${days}` }
                    });
                  }}
                />
              )}
            </Field>
            {errors.scheduleDays && touched.scheduleDays && (
              <div className="text-accent font-medium">
                {errors.scheduleDays}
              </div>
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

export const CreateChoreForm = observer(CreateChoreComponent);
