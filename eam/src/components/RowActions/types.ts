export interface RowActionsProps<T = any> {
  row: T
  onDetail?: ((row: T) => void) | null
  onEdit?: ((row: T) => void) | null
  onDelete?: ((row: T) => void) | null
  detailPermi?: string[]
  editPermi?: string[]
  deletePermi?: string[]
  deleteConfirmText?: string
}
