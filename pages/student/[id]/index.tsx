import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Container, styled } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../../../apollo/apollo";
import { FIND_STUDENT } from "../../../graphql/studentQueries";
import { Student } from "../../../typeDefs/typeDefs";

const Wrapper = styled(Container)({
  "text-align": "center",
});

const AllStudentsPage: React.FC = () => {
  const router = useRouter();
  const { id }: { id?: string } = router.query;
  const { loading, error, data } = useQuery(FIND_STUDENT, { variables: { studentId: id } });

  if (error) {
    const msg = error.message;
    if (msg.toLowerCase().includes("not authorised")) router.push("/teacher/login");
    return <h1>Error: {msg}</h1>;
  }

  if (loading) return <h1>Loading...</h1>;

  const { findStudent: student }: { findStudent: Student } = data;

  return (
    <Wrapper>
      <h1>
        {student.firstName} {student.lastName}
      </h1>
      <h2>Student Number: {student.studentNumber}</h2>
      <h3>Points: {student.numPoints}</h3>
      <div>
        <div>
          <Link href="/student/[id]/award-points" as={`${id!}/award-points`}>
            <a>Award Points</a>
          </Link>
        </div>
        <div>
          <Link href="/student/[id]/use-points" as={`${id!}/use-points`}>
            <a>Use Points</a>
          </Link>
        </div>
        <div>
          <Link href="/student/[id]/transactions" as={`${id!}/transactions`}>
            <a>See Transactions</a>
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(AllStudentsPage);
