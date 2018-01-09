/**
 * @module Number
 * @author razodeh <https://github.com/razodeh>
 */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLocale } from '../../store_elements/selectors';
import { localizeNumber } from '../../utils';

/**
 * @description Number component that renders its passed `value` prop to
 * a date with the current R16N's locale.
 * 
 * It returns the localized number only
 *  <Number value={100000} />
 *      --> When Locale is en -> 100,000
 *      --> When locale is ar -> ١٠٠٬٠٠٠
 */
export const Number = ({ value, locale }) => {
    let number = localizeNumber(value, locale);
    return [number];
}

// Prop Types
Number.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    locale: PropTypes.string,
}

const mapStateToProps = (state) => ({
    locale: getLocale(state),
});

// Connect with Redux
export default connect(mapStateToProps, undefined)(Number);
