import { Box, Button, Text } from "grommet";
import Modal from "./Modal";
import { useFirebase } from "../context/FirebaseContext";
import getPlanDetails from "../utils/getPlanDetails";
import { useNavigate } from "react-router-dom";
import useShow from "../hooks/useShow";
import cancelSubscription from "../lib/cancelSubsctiption";
import retrieveCredential from "../utils/retrieveCredential";
import retrieveSubscription from "../lib/retrieveSubsctiption";

export default function UserAccount({ onClose, onSave }) {

  const { userData, updateDBEntry } = useFirebase()
  const navigate = useNavigate()

  const handleOnConfirm = async () => {
    await cancelSubscription(userData.subscriptionId)
    const credential = retrieveCredential()
    const subscription = await retrieveSubscription(userData.subscriptionId)
    await updateDBEntry(credential.uid, { subscriptionStatus: subscription.status })
    closeCancelPlanConfirmation()
  }
  const handleOnUpgrade = async () => {
    navigate(`/pricing`)
  }
  const { open: openCancelPlanConfirmation, close: closeCancelPlanConfirmation, show } = useShow()
  return (
    <Modal onClose={onClose} closeClickingOutside={false}>
      <Box width="420px" height="360px" pad={{ vertical: "small", horizontal: "medium" }}>
        <Text weight="bold">User Details</Text>
        <Box pad={{ vertical: 'medium' }} gap="small">
          <Box direction="row" justify="between" align="center">
            <Text>{`Plan: ${userData?.plan?.toUpperCase()}`}</Text>
            {
              userData?.plan === "free" || userData?.subscriptionStatus === "canceled" ? (
                <Button onClick={handleOnUpgrade} label="Upgrade" primary />
              ) : (
                <Button onClick={openCancelPlanConfirmation} label="Cancel" primary />
              )
            }
          </Box>
          <Text>{`Status: ${userData?.subscriptionStatus?.toUpperCase()}`}</Text>
          <Text>{`Generated stories: ${userData?.generations}`}</Text>
        </Box>
      </Box>
      {
        show && (
          <Modal onClose={closeCancelPlanConfirmation} closeClickingOutside={false}>
            <Box width="420px" height="120px" pad={{ vertical: "small", horizontal: "medium" }} justify="between">
              <Text textAlign="center">Are you sure about canceling your plan?</Text>
              <Box direction="row" gap="small" justify="between">
                <Button secondary label="Dismiss" onClick={closeCancelPlanConfirmation} />
                <Button primary label="Confirm" onClick={handleOnConfirm} />
              </Box>
            </Box>
          </Modal>
        )
      }
    </Modal>
  )
}