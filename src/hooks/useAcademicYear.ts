import { useGetAcademicYearList } from "@/modules/AccountSettings/api/queryGetAcademicYearList";

const useAcademicYear = () => {
  const getAcademicYearList = useGetAcademicYearList({});

  const latestAcademicYear = getAcademicYearList.data?.data.body[0];

  const isAfterFinalClosureDate = () => {
    return (
      latestAcademicYear?.final_closure_date &&
      new Date() > new Date(latestAcademicYear?.final_closure_date)
    );
  };

  const isIdeaSubmissionOpen = () => {
    return (
      latestAcademicYear?.idea_submission_deadline &&
      new Date() < new Date(latestAcademicYear?.idea_submission_deadline)
    );
  };

  return {
    latestAcademicYear,
    isAfterFinalClosureDate: isAfterFinalClosureDate(),
    isIdeaSubmissionOpen: isIdeaSubmissionOpen(),
  };
};

export default useAcademicYear;
