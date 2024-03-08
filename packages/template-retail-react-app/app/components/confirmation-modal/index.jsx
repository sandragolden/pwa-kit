/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {noop} from '@salesforce/retail-react-app/app/utils/utils'
import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Text
} from '@salesforce/retail-react-app/app/components/shared/ui'

import PropTypes from 'prop-types'
import {CONFIRMATION_DIALOG_DEFAULT_CONFIG} from '@salesforce/retail-react-app/app/pages/account/constant'
import {useIntl} from 'react-intl'

const ConfirmationModal = ({
    dialogTitle = CONFIRMATION_DIALOG_DEFAULT_CONFIG.dialogTitle,
    confirmationMessage = CONFIRMATION_DIALOG_DEFAULT_CONFIG.confirmationMessage,
    primaryActionLabel = CONFIRMATION_DIALOG_DEFAULT_CONFIG.primaryActionLabel,
    alternateActionLabel = CONFIRMATION_DIALOG_DEFAULT_CONFIG.alternateActionLabel,
    hideAlternateAction,
    onPrimaryAction = noop,
    onAlternateAction = noop,
    ...props
}) => {
    const {formatMessage} = useIntl()

    const handleConfirmClick = () => {
        onPrimaryAction()
        props.onClose()
    }

    const handleAlternateActionClick = () => {
        onAlternateAction()
        props.onClose()
    }

    return (
        <AlertDialog
            isOpen={props.isOpen}
            isCentered
            onClose={handleAlternateActionClick}
            {...props}
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>{formatMessage(dialogTitle)}</AlertDialogHeader>
                <AlertDialogBody>
                    <Text>{formatMessage(confirmationMessage)}</Text>
                </AlertDialogBody>

                <AlertDialogFooter>
                    {!hideAlternateAction ? <Button variant="ghost" mr={3} onClick={handleAlternateActionClick}>
                        {formatMessage(alternateActionLabel)}
                    </Button> : null}
                    <Button variant="solid" onClick={handleConfirmClick}>
                        {formatMessage(primaryActionLabel)}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

ConfirmationModal.propTypes = {
    /**
     * Prop to check if modal is open
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * Callback invoked to open the modal
     */
    onOpen: PropTypes.func.isRequired,
    /**
     * Callback invoked to close the modal
     */
    onClose: PropTypes.func.isRequired,
    /**
     * Text to be displayed as modal header
     */
    dialogTitle: PropTypes.object,
    /**
     * Text to display in confirmation modal prompting user to pick an action
     */
    confirmationMessage: PropTypes.object,
    /**
     * Button Label for primary action in confirmation modal
     */
    primaryActionLabel: PropTypes.object,
    /**
     * Button Label for alternate or secondary action in confirmation modal
     */
    alternateActionLabel: PropTypes.object,
    /**
     * Action to execute if user selects primary action
     */
    onPrimaryAction: PropTypes.func,
    /**
     * Action to execute if user selects alternate or secondary action
     */
    onAlternateAction: PropTypes.func
}

export default ConfirmationModal
