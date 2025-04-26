import { useGetAcademicYearList } from "@/modules/AccountSettings/api/queryGetAcademicYearList";
import { AcademicYearData } from "@/modules/AccountSettings/components/Academic";

const useAcademicYear = () => {
  const isFinalClosureDate = () => {
    const getAcademicYearList = useGetAcademicYearList({});

    const academicYear = getAcademicYearList.data?.data.body.find(
      (year: AcademicYearData) => year.status === "active",
    );

    return true;
    return (
      academicYear?.final_closure_date &&
      academicYear?.final_closure_date < new Date()
    );
  };

  return { isFinalClosureDate: isFinalClosureDate() };
};

export default useAcademicYear;
