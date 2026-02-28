export type UserRole = "client" | "club" | "promoter" | "female_vip" | "admin";

export interface BaseProfile {
	id: string;
	email: string;
	role: UserRole;
	createdAt?: string;
	updatedAt?: string;
}

export interface ClientProfile extends BaseProfile {
	firstName?: string;
	lastName?: string;
	phone?: string;
	avatarUrl?: string;
	isPremium?: boolean;
	loyaltyPoints?: number;
	nightTableScore?: number;
	reliabilityScore?: number;
}

export type ClubSubscriptionTier = "starter" | "pro" | "premium";

export interface ClubProfile extends BaseProfile {
	clubName?: string;
	slug?: string;
	description?: string;
	address?: string;
	city?: string;
	phone?: string;
	website?: string;
	instagramHandle?: string;
	logoUrl?: string;
	coverUrl?: string;
	subscriptionTier?: ClubSubscriptionTier;
	subscriptionActive?: boolean;
	stripeCustomerId?: string;
	isVerified?: boolean;
	apiKey?: string;
}

export interface PromoterProfile extends BaseProfile {
	firstName?: string;
	lastName?: string;
	phone?: string;
	instagramHandle?: string;
	promoCode?: string;
	clubId?: string;
	commissionRate?: number;
	totalEarned?: number;
	totalPaid?: number;
	isActive?: boolean;
}

export type FemaleVipValidationStatus = "pending" | "validated" | "rejected";

export interface FemaleVipProfile extends BaseProfile {
	firstName?: string;
	lastName?: string;
	phone?: string;
	avatarUrl?: string;
	instagramHandle?: string;
	validationStatus?: FemaleVipValidationStatus;
	validatedClubs?: string[];
	validatedAt?: string;
}

export interface RegisterClientForm {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
}

export interface RegisterClubForm {
	email: string;
	password: string;
	clubName: string;
	slug?: string;
	phone?: string;
	city?: string;
}

export interface RegisterPromoterForm {
	email: string;
	password: string;
	firstName: string;
	lastName?: string;
	phone?: string;
	instagramHandle?: string;
	commissionRate?: number;
}

export interface RegisterFemaleVipForm {
	email: string;
	password: string;
	firstName: string;
	lastName?: string;
	phone?: string;
	instagramHandle?: string;
}

export type ReservationStatus =
	| "pending"
	| "payment_pending"
	| "confirmed"
	| "reserved"
	| "checked_in"
	| "cancelled"
	| "no_show"
	| "expired";

export interface Reservation {
	id: string;
	eventId: string;
	tableId: string;
	clientId: string;
	promoterId?: string;
	promoCodeUsed?: string;
	status: ReservationStatus;
	minimumConsumption: number;
	prepaymentAmount: number;
	insuranceAmount?: number;
	totalPaidAmount?: number;
	createdAt?: string;
	updatedAt?: string;
}

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type EventTableStatus = "available" | "reserved" | "occupied" | "disabled";

export interface Event {
	id: string;
	clubId: string;
	title: string;
	description?: string;
	date: string;
	startTime: string;
	endTime?: string;
	status: EventStatus;
}

export interface EventTable {
	id: string;
	eventId: string;
	tableId: string;
	status: EventTableStatus;
	basePrice: number;
	dynamicPrice?: number;
	capacity: number;
}

export interface ActionResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}
