/**
 * @module Date
 * @author razodeh <https://github.com/razodeh>
 */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLocale } from '../../store_elements/selectors';
import { localizeDate } from '../../utils';

/**
 * @description Date component that renders its passed `value` prop to
 * a date with the current R16N's locale.
 * 
 * It returns the localized date only
 *  <Date value={1} format="ddd, MMM gggg @ hh:mmA"/>
 *      --> When Locale is en -> Thu, Jan 1970 @ 02:00AM
 *      --> When locale is ar -> خميس، يناير ١٩٧٠ @ ٠٢:٠٠ص
 * 
 *  <Date value={1} format={{en:"ddd, MMM gggg @ hh:mmA", ar: "dddd M gg - hh:mmA"}}/>
 *      --> When locale is en -> Thu, Jan 1970 @ 02:00AM
 *      --> When locale is ar -> الخميس ١ ٧٠ - ٠٢:٠٠ص
 */
export const Date = ({ value, locale, format }) => {
    let date = localizeDate(value, locale, format);
    return [date];
}

// Prop Types
Date.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
    locale: PropTypes.string,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

const mapStateToProps = (state) => ({
    locale: getLocale(state),
});

// Connect with Redux
export default connect(mapStateToProps, undefined)(Date);
