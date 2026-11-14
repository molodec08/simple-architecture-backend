import { tvmazeApi } from '../../shared/tvmaze/index.js';
import { mapShowDetails, type ShowDetails } from '../show-details.js';

/** Таска «показать подробности о сериале» вместе с актёрским составом. */
export const getShowDetails = async (id: number): Promise<ShowDetails> =>
  mapShowDetails(await tvmazeApi.getShowWithCast(id));
