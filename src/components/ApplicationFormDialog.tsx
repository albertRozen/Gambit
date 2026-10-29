import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import styled from 'styled-components'
import type { Application } from '../models/application.ts'
import type { Resource } from '../models/resource.ts'
import { useApplications } from '../state/ApplicationsContext.ts'
import { Button } from '../ui/Button.tsx'
import { Dialog } from '../ui/Dialog.tsx'
import { DialogFooter } from '../ui/DialogFooter.tsx'
import { Input } from '../ui/Input.tsx'
import { Textarea } from '../ui/Textarea.tsx'
import { collapseWhitespace } from '../utils/collapseWhitespace.ts'
import { ResourcePicker } from './ResourcePicker.tsx'

interface ApplicationFormDialogProps {
  application?: Application
  resources: Resource[]
  onClose: () => void
  onSaved: (application: Application) => void
}

export const ApplicationFormDialog = ({
  application,
  resources,
  onClose,
  onSaved,
}: ApplicationFormDialogProps) => {
  const { applications, createApplication, updateApplication } =
    useApplications()
  const isEditing = application !== undefined
  const [name, setName] = useState(application?.name ?? '')
  const [description, setDescription] = useState(application?.description ?? '')
  const [includedResources, setIncludedResources] = useState(resources)
  const [error, setError] = useState<string | null>(null)
  const [resourcesError, setResourcesError] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
    if (isEditing) {
      nameRef.current?.select()
    }
  }, [isEditing])

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = collapseWhitespace(name)
    const nameTaken = applications.some(
      (other) =>
        other.id !== application?.id &&
        collapseWhitespace(other.name).toLowerCase() ===
          trimmedName.toLowerCase(),
    )

    const nameError = !trimmedName
      ? 'Enter a name for the application.'
      : nameTaken
        ? 'An application with this name already exists.'
        : null
    const noResources = includedResources.length === 0

    setError(nameError)
    setResourcesError(noResources)
    if (nameError) {
      nameRef.current?.focus()
      return
    }
    if (noResources) {
      return
    }

    const changes = {
      name: trimmedName,
      description: description.trim() || undefined,
      resourceIds: includedResources.map(({ id }) => id),
    }

    if (application) {
      updateApplication(application.id, changes)
      onSaved({ ...application, ...changes })
    } else {
      onSaved(createApplication(changes))
    }
  }

  return (
    <Dialog
      title={isEditing ? 'Edit application' : 'Create application'}
      description={
        isEditing
          ? 'Change the name, description or resources.'
          : 'Group the selected resources under one name.'
      }
      onClose={onClose}
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="application-name">Name</Label>
          <Input
            ref={nameRef}
            id="application-name"
            value={name}
            placeholder="Enter an application name"
            $invalid={Boolean(error)}
            onChange={(event) => {
              setName(event.target.value)
              setError(null)
            }}
          />
          {error && <ErrorText>{error}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="application-description">
            Description <Hint>(optional)</Hint>
          </Label>
          <Textarea
            id="application-description"
            value={description}
            placeholder="Describe what these resources do together"
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>

        <Field>
          <Label as="span">
            Resources <Hint>({includedResources.length})</Hint>
          </Label>
          <ResourcePicker
            value={includedResources}
            onChange={(next) => {
              setIncludedResources(next)
              setResourcesError(false)
            }}
          />
          {resourcesError && (
            <ErrorText>Select at least one resource.</ErrorText>
          )}
        </Field>

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" $variant="primary">
            {isEditing ? 'Save changes' : 'Create application'}
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`

const Label = styled.label`
  font-weight: 500;
`

const Hint = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`

const ErrorText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
`
