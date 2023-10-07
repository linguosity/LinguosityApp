import { Box, Button, Paragraph, ResponsiveContext, Text } from "grommet";
import { plans } from "../utils/getPlanDetails";
import { Checkmark } from "grommet-icons";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import createCheckoutSession from "../lib/createCheckoutSession";
import retrieveCredential from "../utils/retrieveCredential";

export default function Pricing() {
  const size = useContext(ResponsiveContext)
  const navigate = useNavigate()
  const handleOnChoose = (plan) => {
    const credential = retrieveCredential()
    if (!credential) {
      navigate(`/login?from=pricing&plan=${plan}`)
    } else {
      createCheckoutSession(plan, credential.email)
    }
  }


  return (
    <Box
      height={size === "small" ? "auto" : "100vh"}
      justify="center"
      align="center"
      pad={{ vertical: "large", horizontal: "small" }}
    >
      <Text weight="bold" size="xlarge" margin={{ bottom: "medium" }}>Pricing</Text>
      <Box direction={size === "small" ? "column" : "row"} gap="12px" >
        {
          Object.keys(plans).map(key => (
            <Box
              key={plans[key].title}
              height={size === "small" ? "300px" : "360px"}
              flex={size === "small" ? false : true}
              width="320px"
              background="white"
              round="medium"
              pad="medium"
            >
              <Box height="50%" gap="small">
                <Text textAlign="center" weight="bold" size="large">{plans[key].title}</Text>
                <Text textAlign="center" weight="bold">{`$${plans[key].price}/month`}</Text>
                <Paragraph color="gray" size="small" textAlign="center">
                  {plans[key].description}
                </Paragraph>
              </Box>
              <Box height="40%" margin={{ horizontal: 'auto' }}>
                {
                  plans[key].features.map((feat, i) => (
                    <Box key={i} direction="row" gap="small" align="center">
                      <Checkmark size="small" />
                      <Text key={i} size="1.1rem">{`${feat}`}</Text>
                    </Box>
                  ))
                }
              </Box>
              <Button primary label="Choose" onClick={() => handleOnChoose(key, plans[key].stripePriceId)} />
            </Box>
          ))
        }
      </Box>
    </Box>
  )
}