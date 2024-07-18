"use client";

import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./card-wrapper";
import BeatLoader from "react-spinners/BeatLoader";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

const NewVerificationForm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //   const onSubmit = useCallback(() => {
  //     console.log(token);
  //     if (!token) {
  //       setError("Missing token");
  //       return;
  //     }

  //     newVerification(token)
  //       .then((data) => {
  //         setSuccess(data.success);
  //         setError(data.error);
  //       })
  //       .catch(() => {
  //         setError("Something went wrong!");
  //       });
  //   }, [token]);

  //   useEffect(() => {
  //     onSubmit();
  //   }, [onSubmit]);

  //   MY OWN METHOD
  useEffect(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  return (
    <CardWrapper
      headerLabel='Confirming your verification'
      backButtonLabel='Back to Login'
      backButtonHref='/auth/login'
    >
      <div className='flex items-center w-full justify-center'>
        {!success && !error && <BeatLoader loading={loading} />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
