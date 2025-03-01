import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  priority: Yup.string().required('Required'),
  attachments: Yup.mixed()
});

export default function TicketForm({ onSubmitSuccess }) {
  const { user } = useAuth();

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        priority: 'medium',
        attachments: []
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const formData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            if (key === 'attachments') {
              value.forEach(file => formData.append('attachments', file));
            } else {
              formData.append(key, value);
            }
          });

          const { data } = await api.post('/tickets', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          onSubmitSuccess(data);
        } catch (error) {
          console.error(error);
        }
        setSubmitting(false);
      }}
    >
      {({ setFieldValue, ...formik }) => (
        <Form>
          <TextField
            name="title"
            label="Title"
            fullWidth
            margin="normal"
          />
          
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />

          <input
            type="file"
            multiple
            onChange={e => setFieldValue('attachments', e.target.files)}
          />

          <Button 
            type="submit" 
            disabled={formik.isSubmitting}
          >
            Create Ticket
          </Button>
        </Form>
      )}
    </Formik>
  );
}