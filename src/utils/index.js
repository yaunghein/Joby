import { formatDistanceStrict } from 'date-fns';

export const getSuccessMessageByStatus = (job) => {
	switch (job.status) {
		case 'pending':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Hope you get interview from ${job.company} soon 💚.</span>`;
		case 'interviewed':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Hope you get an offer from ${job.company} soon 💚.</span>`;
		case 'got offer':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Hope this offer from ${job.company} will be the right one for you 💚.</span>`;
		case 'got rejected':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Maybe they don't see the talent. Better opportunities are yet to come 💚.</span>`;
		case 'i rejected':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Hope you find a more worthy offer next time 💚.</span>`;
		case 'current':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Hope you have a great journey @ ${job.company} 💚.</span>`;
		case 'goodbye':
			return `<span class='font-semibold'>Job created successfully.</span><span class='block mt-2 text-xs'>Hope you had great memories @ ${job.company} 💚.</span>`;
		default:
			return `<span class='font-semibold'>Job created successfully.</span>`;
	}
};

export const getDistance = (start, end) => {
	const years = formatDistanceStrict(new Date(start), end ? new Date(end) : new Date(), {
		unit: 'year'
	}).split(' ')[0];
	const months =
		formatDistanceStrict(new Date(start), end ? new Date(end) : new Date(), {
			unit: 'month'
		}).split(' ')[0] -
		years * 12;
	if (months < 0) {
		return `${12 + parseInt(months)}m`;
	}
	return (years > 0 ? `${years}y` : '') + ' ' + (months > 0 ? `${months}m` : '1m');
};
