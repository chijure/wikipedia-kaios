import { usePopup } from '../hooks/index'
import { ConfirmDialog } from '../components/index'

export const confirmDialog = ({
  title, message, onDiscardText, onDiscard = () => {},
  onSubmitText, onSubmit = () => {}
}: any) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { stack: true })
  showConfirmDialog({ title, message, onDiscardText, onDiscard, onSubmitText, onSubmit })
}
