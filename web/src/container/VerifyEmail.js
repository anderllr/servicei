import React, { useEffect } from "react";
import queryString from "query-string";
import { useMutation } from "@apollo/react-hooks";
import { NotificationManager } from "react-notifications";

import { EMAIL_VALIDATE } from "Mutations/userMutation";

export default function VerifyEmail(props) {
    const [loginvalidemail, { data }] = useMutation(EMAIL_VALIDATE);

    useEffect(() => {
        changeValor();
    });

    function changeValor() {
        const values = queryString.parse(props.location.search);
        loginvalidemail({
            variables: { hash: values.v }
        })
            .then(data =>
                NotificationManager.success("E-mail validado com sucesso!")
            )
            .catch(e => {
                const { graphQLErrors } = e;

                const message = graphQLErrors[0].message;

                switch (message) {
                    case "invalid-link":
                        NotificationManager.error("Link inválido!");
                        break;

                    case "invalid-id":
                        NotificationManager.error("ID inválido!");
                        break;

                    case "verified-email":
                        NotificationManager.error(
                            "E-mail já validado anteriormente!"
                        );
                        break;

                    default:
                        NotificationManager.error(`Erro: ${message}`);
                }
            });

        props.history.push("/signin");
    }
    return (
        <div>
            <p>Validando o e-mail...</p>
        </div>
    );
}
