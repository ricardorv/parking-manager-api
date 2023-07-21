import { Router } from "express";
import { z } from "zod";
import { validate } from "../utils/validate";
import Parking from "../service/Parking";
import Payment from "../service/Payment";

export const router = Router();

const postSchema = z.object({
  body: z.object({
    plate: z
      .string({required_error: "plate is required",})
      .regex(new RegExp("^[A-Z]{3}-\\d{4}$"), 'plate needs to be formatted like this: AAA-9999'),
  })
});

router.get('/:plate', function(req, res, next) {
  new Parking().listPlateHistory(req.params.plate)
    .then((result) => res.send(result))
    .catch(next);
});

router.post('/', validate(postSchema), async function(req, res, next) {
  new Parking().checkin(req.body.plate)
    .then((result) => res.status(201).send(result))
    .catch(next);
});
  
router.put('/:id/out', function(req, res, next) {
  new Parking().checkout(req.params.id)
    .then((result) => res.status(200).send(result))
    .catch(next);
});

router.put('/:id/pay', function(req, res, next) {
  new Payment().pay(req.params.id)
    .then((result) => res.status(200).send(result))
    .catch(next);
});