import type { Application } from '../../../models/application.ts'
import { Button } from '../../../ui/Button.tsx'
import { Dialog } from '../../../ui/Dialog.tsx'
import { DialogFooter } from '../../../ui/DialogFooter.tsx'

interface DeleteApplicationDialogProps {
  application: Application
  onClose: () => void
  onConfirm: () => void
}

export const DeleteApplicationDialog = ({
  application,
  onClose,
  onConfirm,
}: DeleteApplicationDialogProps) => (
  <Dialog
    title="Delete application"
    description={`Delete “${application.name}”? Its resources aren't affected, but this can't be undone.`}
    onClose={onClose}
  >
    <DialogFooter>
      <Button type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" $variant="danger" onClick={onConfirm}>
        Delete application
      </Button>
    </DialogFooter>
  </Dialog>
)
