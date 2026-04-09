/** @format */

'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import {
	HOME_BOOTSTRAP_HERO_READY_EVENT,
	HOME_BOOTSTRAP_LOADING_ATTRIBUTE,
} from '@/helpers/storefront/home-bootstrap-loading';

const BOOTSTRAP_COPY_TEXT = 'Preparando sua vitrine inteligente.';
const BOOTSTRAP_PROGRESS_MILESTONES = [
	{ delayMs: 30, progress: 20 },
	{ delayMs: 110, progress: 70 },
	{ delayMs: 220, progress: 90 },
] as const;
const MIN_VISIBLE_DURATION_MS = 300;
const HOLD_FULL_PROGRESS_MS = 60;
const EXIT_DURATION_MS = 160;

type HomeBootstrapState = {
	isVisible: boolean;
	isExiting: boolean;
	progress: number;
	label: string;
};

function subscribeToBootstrapLoading() {
	return () => {};
}

function readBootstrapVisibility() {
	return (
		typeof document !== 'undefined' &&
		document.documentElement.hasAttribute(HOME_BOOTSTRAP_LOADING_ATTRIBUTE)
	);
}

function clearDocumentBootstrapState() {
	document.documentElement.removeAttribute(HOME_BOOTSTRAP_LOADING_ATTRIBUTE);
}

export function useHomeBootstrapProgress(): HomeBootstrapState {
	const isBootstrapEnabled = useSyncExternalStore(
		subscribeToBootstrapLoading,
		readBootstrapVisibility,
		() => false,
	);
	const [state, setState] = useState({
		hasCompleted: false,
		isExiting: false,
		progress: 0,
		label: BOOTSTRAP_COPY_TEXT,
	});
	const timeoutIdsRef = useRef<number[]>([]);
	const animationFrameIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isBootstrapEnabled) {
			return;
		}

		let minimumVisibleReached = false;
		let heroReadyReceived = false;
		let exitScheduled = false;

		const scheduleTimeout = (callback: () => void, delayMs: number) => {
			const timeoutId = window.setTimeout(callback, delayMs);
			timeoutIdsRef.current.push(timeoutId);

			return timeoutId;
		};

		const startExit = () => {
			if (exitScheduled) {
				return;
			}

			exitScheduled = true;
			animationFrameIdRef.current = window.requestAnimationFrame(() => {
				setState((currentState) => ({
					...currentState,
					progress: 100,
				}));

				scheduleTimeout(() => {
					setState((currentState) => ({
						...currentState,
						isExiting: true,
					}));

					scheduleTimeout(() => {
						clearDocumentBootstrapState();
						setState((currentState) => ({
							...currentState,
							hasCompleted: true,
							isExiting: false,
						}));
					}, EXIT_DURATION_MS);
				}, HOLD_FULL_PROGRESS_MS);
			});
		};

		const maybeFinishBootstrap = () => {
			if (!minimumVisibleReached || !heroReadyReceived) {
				return;
			}

			startExit();
		};

		const handleHeroReady = () => {
			heroReadyReceived = true;
			maybeFinishBootstrap();
		};

		window.addEventListener(
			HOME_BOOTSTRAP_HERO_READY_EVENT,
			handleHeroReady,
		);

		for (const milestone of BOOTSTRAP_PROGRESS_MILESTONES) {
			scheduleTimeout(() => {
				setState((currentState) => ({
					...currentState,
					progress: milestone.progress,
				}));
			}, milestone.delayMs);
		}

		scheduleTimeout(() => {
			minimumVisibleReached = true;
			maybeFinishBootstrap();
		}, MIN_VISIBLE_DURATION_MS);

		return () => {
			window.removeEventListener(
				HOME_BOOTSTRAP_HERO_READY_EVENT,
				handleHeroReady,
			);

			for (const timeoutId of timeoutIdsRef.current) {
				window.clearTimeout(timeoutId);
			}
			timeoutIdsRef.current = [];

			if (animationFrameIdRef.current !== null) {
				window.cancelAnimationFrame(animationFrameIdRef.current);
				animationFrameIdRef.current = null;
			}

			clearDocumentBootstrapState();
		};
	}, [isBootstrapEnabled]);

	return {
		isVisible: isBootstrapEnabled && !state.hasCompleted,
		isExiting: state.isExiting,
		progress: state.progress,
		label: state.label,
	};
}
