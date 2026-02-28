-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promoter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.female_vip_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promoter_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role() = 'admin');

-- Client profiles policies
CREATE POLICY "Clients can view their own profile" ON public.client_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Clients can update their own profile" ON public.client_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage client profiles" ON public.client_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Club profiles policies (public read for published clubs)
CREATE POLICY "Anyone can view club profiles" ON public.club_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Clubs can update their own profile" ON public.club_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage club profiles" ON public.club_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Promoter profiles policies
CREATE POLICY "Promoters can view their own profile" ON public.promoter_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Promoters can update their own profile" ON public.promoter_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Clubs can view their promoters" ON public.promoter_profiles
  FOR SELECT USING (
    club_id IN (SELECT id FROM public.club_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Service role can manage promoter profiles" ON public.promoter_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Female VIP profiles policies
CREATE POLICY "VIPs can view their own profile" ON public.female_vip_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "VIPs can update their own profile" ON public.female_vip_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage vip profiles" ON public.female_vip_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Events policies
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status IN ('published', 'completed'));

CREATE POLICY "Clubs can manage their own events" ON public.events
  FOR ALL USING (auth.uid() = club_id);

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.get_user_role() = 'admin');

-- Tables policies
CREATE POLICY "Anyone can view active tables" ON public.tables
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Clubs can manage their own tables" ON public.tables
  FOR ALL USING (auth.uid() = club_id);

-- Event tables policies
CREATE POLICY "Anyone can view event tables" ON public.event_tables
  FOR SELECT USING (TRUE);

CREATE POLICY "Clubs can manage event tables for their events" ON public.event_tables
  FOR ALL USING (
    event_id IN (SELECT id FROM public.events WHERE club_id = auth.uid())
  );

-- Reservations policies
CREATE POLICY "Clients can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Clients can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clubs can view reservations for their events" ON public.reservations
  FOR SELECT USING (
    event_id IN (SELECT id FROM public.events WHERE club_id = auth.uid())
  );

CREATE POLICY "Promoters can view reservations they referred" ON public.reservations
  FOR SELECT USING (auth.uid() = promoter_id);

CREATE POLICY "Service role can manage all reservations" ON public.reservations
  FOR ALL USING (auth.role() = 'service_role');

-- Commissions policies
CREATE POLICY "Promoters can view their own commissions" ON public.commissions
  FOR SELECT USING (auth.uid() = promoter_id);

CREATE POLICY "Service role can manage commissions" ON public.commissions
  FOR ALL USING (auth.role() = 'service_role');

-- Guest lists policies
CREATE POLICY "Promoters can manage their guest lists" ON public.guest_lists
  FOR ALL USING (auth.uid() = promoter_id);

CREATE POLICY "Clubs can view guest lists for their events" ON public.guest_lists
  FOR SELECT USING (
    event_id IN (SELECT id FROM public.events WHERE club_id = auth.uid())
  );

-- Auction bids policies
CREATE POLICY "Users can view all auction bids" ON public.auction_bids
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can place bids" ON public.auction_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Waitlist policies
CREATE POLICY "Clients can manage their waitlist entries" ON public.waitlist
  FOR ALL USING (auth.uid() = client_id);

-- Resales policies
CREATE POLICY "Anyone can view listed resales" ON public.resales
  FOR SELECT USING (status = 'listed');

CREATE POLICY "Sellers can manage their resales" ON public.resales
  FOR ALL USING (auth.uid() = seller_id);

-- Promoter clicks policies
CREATE POLICY "Service role can manage promoter clicks" ON public.promoter_clicks
  FOR ALL USING (auth.role() = 'service_role');
