import ReportCreate from './index';

// This page simply renders ReportCreate.
// The prefill is passed via location.state and consumed inside ReportForm.
const CreateReportPage = () => {
  return <ReportCreate />;
};

export default CreateReportPage;
