import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslation } from '../../store_elements/selectors';

/**
 * @description Translation component that renders translated text from `R16N` depending on
 * `tKey` prop that points to its location inside of its locale object.
 * 
 * Suppose that your have locales object is the following:
 * {
 *      en: {
 *          titles: {
 *              hello: 'Hello, World!'
 *          }
 *      },
 *      ar: {
 *          titles: {
 *              hello: 'مرحباً أيها العالم!'
 *          }
 *      }
 * }
 * 
 * It returnrsthe translated text only
 *  <Translation tKey='titles.hello'/> 
 *      When locale is 'en' --> Hello, World!
 *      When locale is 'ar' --> مرحباً ايها العالم!
 */
export const Translation = ({ translation }) => {
    return [translation];
}

// Prop Types
Translation.propTypes = {
    tKey: PropTypes.string.isRequired,
    translation: PropTypes.string
};

const mapStateToProps = (state, props) => ({
    translation: getTranslation(state, props.tKey, props.count),
});

// Connect with Redux
export default connect(mapStateToProps, undefined)(Translation);
