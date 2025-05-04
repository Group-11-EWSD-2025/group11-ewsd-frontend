import { useGetAcademicYearList } from "@/modules/AccountSettings/api/queryGetAcademicYearList";
import { AcademicYearData } from "@/modules/AccountSettings/components/Academic";

const useAcademicYear = () => {
  const getAcademicYearList = useGetAcademicYearList({});

  const academicYear = getAcademicYearList.data?.data.body.find(
    (year: AcademicYearData) => year.status === "active",
  );

  const latestAcademicYear = getAcademicYearList.data?.data.body[0];

  const isAfterFinalClosureDate = () => {
    return (
      latestAcademicYear?.final_closure_date &&
      new Date() > new Date(latestAcademicYear?.final_closure_date)
    );
  };

  const isIdeaSubmissionOpen = () => {
    return (
      academicYear?.idea_submission_deadline &&
      new Date() < new Date(academicYear?.idea_submission_deadline)
    );
  };

  return {
    academicYear,
    isAfterFinalClosureDate: isAfterFinalClosureDate(),
    isIdeaSubmissionOpen: isIdeaSubmissionOpen(),
  };
};

export default useAcademicYear;
