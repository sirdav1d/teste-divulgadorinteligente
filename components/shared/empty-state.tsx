/** @format */

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

type EmptyStateProps = {
	title: string;
	description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<svg
						aria-hidden='true'
						viewBox='0 0 24 24'
						className='h-6 w-6'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.8'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<circle
							cx='11'
							cy='11'
							r='7'
						/>
						<path d='m20 20-3.5-3.5' />
					</svg>
				</EmptyMedia>

				<EmptyTitle className='mt-4 text-balance'>{title}</EmptyTitle>
				<EmptyDescription className='text-balance'>
					{description}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
