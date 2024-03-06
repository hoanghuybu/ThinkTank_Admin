import { CCard, CCardBody, CCardTitle, CCardText, CCardImage, CBadge } from '@coreui/react';
import './TopGameCard.scss';
import images from '~/assets/images';

function TopGameCard({ rank, title, description, image }) {
    let medalImage;
    if (rank === 1) {
        medalImage = images.medalOne;
    } else if (rank === 2) {
        medalImage = images.medalTwo;
    } else if (rank === 3) {
        medalImage = images.medalThree;
    }
    return (
        <CCard className="dashboard-card">
            <CBadge style={{ '--cui-badge-color': 'red' }} position="top-end" shape="rounded-bottom">
                <img style={{ width: '70px', height: '70px' }} src={medalImage} alt="Medal"></img>
            </CBadge>
            <CCardImage top src={image} alt={title} />
            <CCardBody>
                <CCardTitle>{title}</CCardTitle>
                <CCardText>{description}</CCardText>
            </CCardBody>
        </CCard>
    );
}

export default TopGameCard;
