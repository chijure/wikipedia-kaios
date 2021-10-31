import { usePopup } from '../hooks'
import { ConfirmDialog } from '../components'

export const useConfirmDialog = (): any => {
  const [showPopup] = usePopup(ConfirmDialog, { stack: true })
  const showConfirmDialog = ({
    title,
    message,
    onDiscardText,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDiscard = () => {
    },
    onSubmitText,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit = () => {
    }
  }) => {
    showPopup({
      title,
      message,
      onDiscardText,
      onDiscard,
      onSubmitText,
      onSubmit
    })
  }
  return showConfirmDialog
}
