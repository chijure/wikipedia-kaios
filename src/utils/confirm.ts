import { usePopup } from '../hooks/index'
import { ConfirmDialog } from '../components/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
/* eslint-disable  @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const confirmDialog = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  title, message, onDiscardText, onDiscard = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmitText, onSubmit = () => {}
}: any) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { stack: true })
  showConfirmDialog({ title, message, onDiscardText, onDiscard, onSubmitText, onSubmit })
}
