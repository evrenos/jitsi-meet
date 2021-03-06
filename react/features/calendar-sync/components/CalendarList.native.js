// @flow

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { openSettings } from '../../mobile/permissions';
import { translate } from '../../base/i18n';

import { isCalendarEnabled } from '../functions';
import styles from './styles';

import BaseCalendarList from './BaseCalendarList';

/**
 * The tyoe of the React {@code Component} props of {@link CalendarList}.
 */
type Props = {

    /**
     * The current state of the calendar access permission.
     */
    _authorization: ?string,

    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean,

    /**
     * The translate function.
     */
    t: Function
};

/**
 * Component to display a list of events from the (mobile) user's calendar.
 */
class CalendarList extends Component<Props> {
    /**
     * Initializes a new {@code CalendarList} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._getRenderListEmptyComponent
            = this._getRenderListEmptyComponent.bind(this);
    }

    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { disabled } = this.props;

        return (
            BaseCalendarList
                ? <BaseCalendarList
                    disabled = { disabled }
                    renderListEmptyComponent
                        = { this._getRenderListEmptyComponent() } />
                : null
        );
    }

    _getRenderListEmptyComponent: () => Object;

    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {?React$Component}
     */
    _getRenderListEmptyComponent() {
        const { _authorization, t } = this.props;

        // If we don't provide a list specific renderListEmptyComponent, then
        // the default empty component of the NavigateSectionList will be
        // rendered, which (atm) is a simple "Pull to refresh" message.
        if (_authorization !== 'denied') {
            return undefined;
        }

        return (
            <View style = { styles.noPermissionMessageView }>
                <Text style = { styles.noPermissionMessageText }>
                    { t('calendarSync.permissionMessage') }
                </Text>
                <TouchableOpacity
                    onPress = { openSettings }
                    style = { styles.noPermissionMessageButton } >
                    <Text style = { styles.noPermissionMessageButtonText }>
                        { t('calendarSync.permissionButton') }
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _authorization: ?string,
 *     _eventList: Array<Object>
 * }}
 */
function _mapStateToProps(state: Object) {
    const { authorization } = state['features/calendar-sync'];

    return {
        _authorization: authorization
    };
}

export default isCalendarEnabled()
    ? translate(connect(_mapStateToProps)(CalendarList))
    : undefined;
