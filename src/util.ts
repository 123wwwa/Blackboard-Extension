export const getAnnouncementDisplayText = (text: string) => {
	switch (text) {
		case "Announcement Available":
			return "공지";
		case "Content Available":
			return "자료";
		case "Discussion Available": // 수정 필요
			return "디스커션";
		case "Assignment Available":
		case "Assignment Group Assignment Available":
		case "Assignment Available Resend":
			return "과제";
		case "Manual Grade Updated":
		case "Attempt Grade Updated":
			return "점수";
		case "Survey Available":
			return "설문조사";
		case "Course or Organization Available":
			return "코스 개설";
		default:
			return text;
	}
};
