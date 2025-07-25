// SHA-256 implementation
//
// Implementation notes:
// The round loops are unrolled. This was mainly motivated by reducing the heap
// allocations but it also reduced the instructions significantly.
//
// Copyright 2023-2025 MR Research AG
//
// Author: Timo Hanke (timohanke)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Source: https://github.com/research-ag/sha2


/// Cycle-optimized Sha256 variants.
///
/// Features:
///
/// * Algorithms: `sha256`, `sha224`
/// * Input types: `Blob`, `[Nat8]`, `Iter<Nat8>`
/// * Output types: `Blob`

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Prim "mo:prim";

module {
  public type Algorithm = { #sha224; #sha256 };
  public type StaticSha256 = {
    msg : [Nat16];
    digest : [Nat8];
    i_msg : Nat8;
    i_block : Nat32;
    high : Bool;
    word : Nat16;

    // state variables in Nat16 form
    sh : [Nat16];
    sl : [Nat16];
  };

  let K00 : Nat32 = 0x428a2f98;
  let K01 : Nat32 = 0x71374491;
  let K02 : Nat32 = 0xb5c0fbcf;
  let K03 : Nat32 = 0xe9b5dba5;
  let K04 : Nat32 = 0x3956c25b;
  let K05 : Nat32 = 0x59f111f1;
  let K06 : Nat32 = 0x923f82a4;
  let K07 : Nat32 = 0xab1c5ed5;
  let K08 : Nat32 = 0xd807aa98;
  let K09 : Nat32 = 0x12835b01;
  let K10 : Nat32 = 0x243185be;
  let K11 : Nat32 = 0x550c7dc3;
  let K12 : Nat32 = 0x72be5d74;
  let K13 : Nat32 = 0x80deb1fe;
  let K14 : Nat32 = 0x9bdc06a7;
  let K15 : Nat32 = 0xc19bf174;
  let K16 : Nat32 = 0xe49b69c1;
  let K17 : Nat32 = 0xefbe4786;
  let K18 : Nat32 = 0x0fc19dc6;
  let K19 : Nat32 = 0x240ca1cc;
  let K20 : Nat32 = 0x2de92c6f;
  let K21 : Nat32 = 0x4a7484aa;
  let K22 : Nat32 = 0x5cb0a9dc;
  let K23 : Nat32 = 0x76f988da;
  let K24 : Nat32 = 0x983e5152;
  let K25 : Nat32 = 0xa831c66d;
  let K26 : Nat32 = 0xb00327c8;
  let K27 : Nat32 = 0xbf597fc7;
  let K28 : Nat32 = 0xc6e00bf3;
  let K29 : Nat32 = 0xd5a79147;
  let K30 : Nat32 = 0x06ca6351;
  let K31 : Nat32 = 0x14292967;
  let K32 : Nat32 = 0x27b70a85;
  let K33 : Nat32 = 0x2e1b2138;
  let K34 : Nat32 = 0x4d2c6dfc;
  let K35 : Nat32 = 0x53380d13;
  let K36 : Nat32 = 0x650a7354;
  let K37 : Nat32 = 0x766a0abb;
  let K38 : Nat32 = 0x81c2c92e;
  let K39 : Nat32 = 0x92722c85;
  let K40 : Nat32 = 0xa2bfe8a1;
  let K41 : Nat32 = 0xa81a664b;
  let K42 : Nat32 = 0xc24b8b70;
  let K43 : Nat32 = 0xc76c51a3;
  let K44 : Nat32 = 0xd192e819;
  let K45 : Nat32 = 0xd6990624;
  let K46 : Nat32 = 0xf40e3585;
  let K47 : Nat32 = 0x106aa070;
  let K48 : Nat32 = 0x19a4c116;
  let K49 : Nat32 = 0x1e376c08;
  let K50 : Nat32 = 0x2748774c;
  let K51 : Nat32 = 0x34b0bcb5;
  let K52 : Nat32 = 0x391c0cb3;
  let K53 : Nat32 = 0x4ed8aa4a;
  let K54 : Nat32 = 0x5b9cca4f;
  let K55 : Nat32 = 0x682e6ff3;
  let K56 : Nat32 = 0x748f82ee;
  let K57 : Nat32 = 0x78a5636f;
  let K58 : Nat32 = 0x84c87814;
  let K59 : Nat32 = 0x8cc70208;
  let K60 : Nat32 = 0x90befffa;
  let K61 : Nat32 = 0xa4506ceb;
  let K62 : Nat32 = 0xbef9a3f7;
  let K63 : Nat32 = 0xc67178f2;

  let rot = Nat32.bitrotRight;

  let nat64To32 = Prim.nat64ToNat32;
  let nat32To16 = Prim.nat32ToNat16;
  let nat32To64 = Prim.nat32ToNat64;
  let nat16To32 = Prim.nat16ToNat32;
  let _nat16To8 = Prim.nat16ToNat8;
  let nat8To16 = Prim.nat8ToNat16;

  public class Digest(algo_ : Algorithm) {
    public func algo() : Algorithm = algo_;

    // state variables in Nat16 form
    var s0h : Nat16 = 0; var s0l : Nat16 = 0;
    var s1h : Nat16 = 0; var s1l : Nat16 = 0;
    var s2h : Nat16 = 0; var s2l : Nat16 = 0;
    var s3h : Nat16 = 0; var s3l : Nat16 = 0;
    var s4h : Nat16 = 0; var s4l : Nat16 = 0;
    var s5h : Nat16 = 0; var s5l : Nat16 = 0;
    var s6h : Nat16 = 0; var s6l : Nat16 = 0;
    var s7h : Nat16 = 0; var s7l : Nat16 = 0;

    let msg : [var Nat16] = Array.init<Nat16>(32, 0);
    let digest = switch (algo_) {
      case (#sha224) Array.init<Nat8>(28, 0);
      case (#sha256) Array.init<Nat8>(32, 0);
    };

    var i_msg : Nat8 = 0;
    var i_block : Nat32 = 0;
    var high : Bool = true;

    public func reset() {
      i_msg := 0;
      i_block := 0;
      high := true;
      if (algo_ == #sha224) {
          s0h := 0xc105; s0l := 0x9ed8;
          s1h := 0x367c; s1l := 0xd507;
          s2h := 0x3070; s2l := 0xdd17;
          s3h := 0xf70e; s3l := 0x5939;
          s4h := 0xffc0; s4l := 0x0b31;
          s5h := 0x6858; s5l := 0x1511;
          s6h := 0x64f9; s6l := 0x8fa7;
          s7h := 0xbefa; s7l := 0x4fa4;
      } else {
          s0h := 0x6a09; s0l := 0xe667;
          s1h := 0xbb67; s1l := 0xae85;
          s2h := 0x3c6e; s2l := 0xf372;
          s3h := 0xa54f; s3l := 0xf53a;
          s4h := 0x510e; s4l := 0x527f;
          s5h := 0x9b05; s5l := 0x688c;
          s6h := 0x1f83; s6l := 0xd9ab;
          s7h := 0x5be0; s7l := 0xcd19;
      };
    };

    reset();

    var word : Nat16 = 0;
    private func writeByte(val : Nat8) : () {
      if (high) {
        word := nat8To16(val) << 8;
        high := false;
      } else {
        msg[Nat8.toNat(i_msg)] := word ^ nat8To16(val);
        i_msg +%= 1;
        high := true;
      };
      if (i_msg == 32) {
        process_block_from_buffer();
        i_msg := 0;
        i_block +%= 1;
      };
    };

    // We must be at a Nat16 boundary, i.e. high must be true
    /*
    private func writeWord(val : Nat32) : () {
      assert (high);
      msg[Nat8.toNat(i_msg)] := nat32To16(val >> 16);
      msg[Nat8.toNat(i_msg +% 1)] := nat32To16(val & 0xffff);
      i_msg +%= 2;
      if (i_msg == 32) {
        process_block();
        i_msg := 0;
        i_block +%= 1;
      };
    };
    */

    private func writePadding() : () {
      // n_bits = length of message in bits
      let t : Nat8 = if (high) i_msg << 1 else i_msg << 1 +% 1;
      let n_bits : Nat64 = ((nat32To64(i_block) << 6) +% Nat64.fromIntWrap(Nat8.toNat(t))) << 3;
      // separator byte
      if (high) {
        msg[Nat8.toNat(i_msg)] := 0x8000;
      } else {
        msg[Nat8.toNat(i_msg)] := word | 0x80;
      };
      i_msg +%= 1;
      // zero padding with extra block if necessary
      if (i_msg > 28) {
        while (i_msg < 32) {
          msg[Nat8.toNat(i_msg)] := 0;
          i_msg +%= 1;
        };
        process_block_from_buffer();
        i_msg := 0;
        // skipping here: i_block +%= 1;
      };
      // zero padding in last block
      while (i_msg < 28) {
        msg[Nat8.toNat(i_msg)] := 0;
        i_msg +%= 1;
      };
      // 8 length bytes
      // Note: this exactly fills the block buffer, hence process_block will get
      // triggered by the last writeByte
      let lh = nat64To32(n_bits >> 32);
      let ll = nat64To32(n_bits & 0xffffffff);
      msg[28] := nat32To16(lh >> 16);
      msg[29] := nat32To16(lh & 0xffff);
      msg[30] := nat32To16(ll >> 16);
      msg[31] := nat32To16(ll & 0xffff);
      process_block_from_buffer();
      // skipping here: i_msg := 0;
    };

    public func share() : StaticSha256 = {
      i_msg;
      i_block;
      high;
      word;
      msg = Array.freeze(msg);
      digest = Array.freeze(digest);

      // state variables in Nat16 form
      sh = [s0h, s1h, s2h, s3h, s4h, s5h, s6h, s7h];
      sl = [s0l, s1l, s2l, s3l, s4l, s5l, s6l, s7l];
    };

    public func unshare(state : StaticSha256) {
      assert msg.size() == state.msg.size();
      assert digest.size() == state.digest.size();

      i_msg := state.i_msg;
      i_block := state.i_block;
      high := state.high;
      word := state.word;

      for (i in msg.keys()) {
        msg[i] := state.msg[i];
      };

      for (i in digest.keys()) {
        digest[i] := state.digest[i];
      };

      s0h := state.sh[0]; s0l := state.sl[0];
      s1h := state.sh[1]; s1l := state.sl[1];
      s2h := state.sh[2]; s2l := state.sl[2];
      s3h := state.sh[3]; s3l := state.sl[3];
      s4h := state.sh[4]; s4l := state.sl[4];
      s5h := state.sh[5]; s5l := state.sl[5];
      s6h := state.sh[6]; s6l := state.sl[6];
      s7h := state.sh[7]; s7l := state.sl[7];

    };

    private func process_block_from_buffer() : () {
      let w00 = nat16To32(msg[0]) << 16 | nat16To32(msg[1]);
      let w01 = nat16To32(msg[2]) << 16 | nat16To32(msg[3]);
      let w02 = nat16To32(msg[4]) << 16 | nat16To32(msg[5]);
      let w03 = nat16To32(msg[6]) << 16 | nat16To32(msg[7]);
      let w04 = nat16To32(msg[8]) << 16 | nat16To32(msg[9]);
      let w05 = nat16To32(msg[10]) << 16 | nat16To32(msg[11]);
      let w06 = nat16To32(msg[12]) << 16 | nat16To32(msg[13]);
      let w07 = nat16To32(msg[14]) << 16 | nat16To32(msg[15]);
      let w08 = nat16To32(msg[16]) << 16 | nat16To32(msg[17]);
      let w09 = nat16To32(msg[18]) << 16 | nat16To32(msg[19]);
      let w10 = nat16To32(msg[20]) << 16 | nat16To32(msg[21]);
      let w11 = nat16To32(msg[22]) << 16 | nat16To32(msg[23]);
      let w12 = nat16To32(msg[24]) << 16 | nat16To32(msg[25]);
      let w13 = nat16To32(msg[26]) << 16 | nat16To32(msg[27]);
      let w14 = nat16To32(msg[28]) << 16 | nat16To32(msg[29]);
      let w15 = nat16To32(msg[30]) << 16 | nat16To32(msg[31]);
      let w16 = w00 +% rot(w01, 07) ^ rot(w01, 18) ^ (w01 >> 03) +% w09 +% rot(w14, 17) ^ rot(w14, 19) ^ (w14 >> 10);
      let w17 = w01 +% rot(w02, 07) ^ rot(w02, 18) ^ (w02 >> 03) +% w10 +% rot(w15, 17) ^ rot(w15, 19) ^ (w15 >> 10);
      let w18 = w02 +% rot(w03, 07) ^ rot(w03, 18) ^ (w03 >> 03) +% w11 +% rot(w16, 17) ^ rot(w16, 19) ^ (w16 >> 10);
      let w19 = w03 +% rot(w04, 07) ^ rot(w04, 18) ^ (w04 >> 03) +% w12 +% rot(w17, 17) ^ rot(w17, 19) ^ (w17 >> 10);
      let w20 = w04 +% rot(w05, 07) ^ rot(w05, 18) ^ (w05 >> 03) +% w13 +% rot(w18, 17) ^ rot(w18, 19) ^ (w18 >> 10);
      let w21 = w05 +% rot(w06, 07) ^ rot(w06, 18) ^ (w06 >> 03) +% w14 +% rot(w19, 17) ^ rot(w19, 19) ^ (w19 >> 10);
      let w22 = w06 +% rot(w07, 07) ^ rot(w07, 18) ^ (w07 >> 03) +% w15 +% rot(w20, 17) ^ rot(w20, 19) ^ (w20 >> 10);
      let w23 = w07 +% rot(w08, 07) ^ rot(w08, 18) ^ (w08 >> 03) +% w16 +% rot(w21, 17) ^ rot(w21, 19) ^ (w21 >> 10);
      let w24 = w08 +% rot(w09, 07) ^ rot(w09, 18) ^ (w09 >> 03) +% w17 +% rot(w22, 17) ^ rot(w22, 19) ^ (w22 >> 10);
      let w25 = w09 +% rot(w10, 07) ^ rot(w10, 18) ^ (w10 >> 03) +% w18 +% rot(w23, 17) ^ rot(w23, 19) ^ (w23 >> 10);
      let w26 = w10 +% rot(w11, 07) ^ rot(w11, 18) ^ (w11 >> 03) +% w19 +% rot(w24, 17) ^ rot(w24, 19) ^ (w24 >> 10);
      let w27 = w11 +% rot(w12, 07) ^ rot(w12, 18) ^ (w12 >> 03) +% w20 +% rot(w25, 17) ^ rot(w25, 19) ^ (w25 >> 10);
      let w28 = w12 +% rot(w13, 07) ^ rot(w13, 18) ^ (w13 >> 03) +% w21 +% rot(w26, 17) ^ rot(w26, 19) ^ (w26 >> 10);
      let w29 = w13 +% rot(w14, 07) ^ rot(w14, 18) ^ (w14 >> 03) +% w22 +% rot(w27, 17) ^ rot(w27, 19) ^ (w27 >> 10);
      let w30 = w14 +% rot(w15, 07) ^ rot(w15, 18) ^ (w15 >> 03) +% w23 +% rot(w28, 17) ^ rot(w28, 19) ^ (w28 >> 10);
      let w31 = w15 +% rot(w16, 07) ^ rot(w16, 18) ^ (w16 >> 03) +% w24 +% rot(w29, 17) ^ rot(w29, 19) ^ (w29 >> 10);
      let w32 = w16 +% rot(w17, 07) ^ rot(w17, 18) ^ (w17 >> 03) +% w25 +% rot(w30, 17) ^ rot(w30, 19) ^ (w30 >> 10);
      let w33 = w17 +% rot(w18, 07) ^ rot(w18, 18) ^ (w18 >> 03) +% w26 +% rot(w31, 17) ^ rot(w31, 19) ^ (w31 >> 10);
      let w34 = w18 +% rot(w19, 07) ^ rot(w19, 18) ^ (w19 >> 03) +% w27 +% rot(w32, 17) ^ rot(w32, 19) ^ (w32 >> 10);
      let w35 = w19 +% rot(w20, 07) ^ rot(w20, 18) ^ (w20 >> 03) +% w28 +% rot(w33, 17) ^ rot(w33, 19) ^ (w33 >> 10);
      let w36 = w20 +% rot(w21, 07) ^ rot(w21, 18) ^ (w21 >> 03) +% w29 +% rot(w34, 17) ^ rot(w34, 19) ^ (w34 >> 10);
      let w37 = w21 +% rot(w22, 07) ^ rot(w22, 18) ^ (w22 >> 03) +% w30 +% rot(w35, 17) ^ rot(w35, 19) ^ (w35 >> 10);
      let w38 = w22 +% rot(w23, 07) ^ rot(w23, 18) ^ (w23 >> 03) +% w31 +% rot(w36, 17) ^ rot(w36, 19) ^ (w36 >> 10);
      let w39 = w23 +% rot(w24, 07) ^ rot(w24, 18) ^ (w24 >> 03) +% w32 +% rot(w37, 17) ^ rot(w37, 19) ^ (w37 >> 10);
      let w40 = w24 +% rot(w25, 07) ^ rot(w25, 18) ^ (w25 >> 03) +% w33 +% rot(w38, 17) ^ rot(w38, 19) ^ (w38 >> 10);
      let w41 = w25 +% rot(w26, 07) ^ rot(w26, 18) ^ (w26 >> 03) +% w34 +% rot(w39, 17) ^ rot(w39, 19) ^ (w39 >> 10);
      let w42 = w26 +% rot(w27, 07) ^ rot(w27, 18) ^ (w27 >> 03) +% w35 +% rot(w40, 17) ^ rot(w40, 19) ^ (w40 >> 10);
      let w43 = w27 +% rot(w28, 07) ^ rot(w28, 18) ^ (w28 >> 03) +% w36 +% rot(w41, 17) ^ rot(w41, 19) ^ (w41 >> 10);
      let w44 = w28 +% rot(w29, 07) ^ rot(w29, 18) ^ (w29 >> 03) +% w37 +% rot(w42, 17) ^ rot(w42, 19) ^ (w42 >> 10);
      let w45 = w29 +% rot(w30, 07) ^ rot(w30, 18) ^ (w30 >> 03) +% w38 +% rot(w43, 17) ^ rot(w43, 19) ^ (w43 >> 10);
      let w46 = w30 +% rot(w31, 07) ^ rot(w31, 18) ^ (w31 >> 03) +% w39 +% rot(w44, 17) ^ rot(w44, 19) ^ (w44 >> 10);
      let w47 = w31 +% rot(w32, 07) ^ rot(w32, 18) ^ (w32 >> 03) +% w40 +% rot(w45, 17) ^ rot(w45, 19) ^ (w45 >> 10);
      let w48 = w32 +% rot(w33, 07) ^ rot(w33, 18) ^ (w33 >> 03) +% w41 +% rot(w46, 17) ^ rot(w46, 19) ^ (w46 >> 10);
      let w49 = w33 +% rot(w34, 07) ^ rot(w34, 18) ^ (w34 >> 03) +% w42 +% rot(w47, 17) ^ rot(w47, 19) ^ (w47 >> 10);
      let w50 = w34 +% rot(w35, 07) ^ rot(w35, 18) ^ (w35 >> 03) +% w43 +% rot(w48, 17) ^ rot(w48, 19) ^ (w48 >> 10);
      let w51 = w35 +% rot(w36, 07) ^ rot(w36, 18) ^ (w36 >> 03) +% w44 +% rot(w49, 17) ^ rot(w49, 19) ^ (w49 >> 10);
      let w52 = w36 +% rot(w37, 07) ^ rot(w37, 18) ^ (w37 >> 03) +% w45 +% rot(w50, 17) ^ rot(w50, 19) ^ (w50 >> 10);
      let w53 = w37 +% rot(w38, 07) ^ rot(w38, 18) ^ (w38 >> 03) +% w46 +% rot(w51, 17) ^ rot(w51, 19) ^ (w51 >> 10);
      let w54 = w38 +% rot(w39, 07) ^ rot(w39, 18) ^ (w39 >> 03) +% w47 +% rot(w52, 17) ^ rot(w52, 19) ^ (w52 >> 10);
      let w55 = w39 +% rot(w40, 07) ^ rot(w40, 18) ^ (w40 >> 03) +% w48 +% rot(w53, 17) ^ rot(w53, 19) ^ (w53 >> 10);
      let w56 = w40 +% rot(w41, 07) ^ rot(w41, 18) ^ (w41 >> 03) +% w49 +% rot(w54, 17) ^ rot(w54, 19) ^ (w54 >> 10);
      let w57 = w41 +% rot(w42, 07) ^ rot(w42, 18) ^ (w42 >> 03) +% w50 +% rot(w55, 17) ^ rot(w55, 19) ^ (w55 >> 10);
      let w58 = w42 +% rot(w43, 07) ^ rot(w43, 18) ^ (w43 >> 03) +% w51 +% rot(w56, 17) ^ rot(w56, 19) ^ (w56 >> 10);
      let w59 = w43 +% rot(w44, 07) ^ rot(w44, 18) ^ (w44 >> 03) +% w52 +% rot(w57, 17) ^ rot(w57, 19) ^ (w57 >> 10);
      let w60 = w44 +% rot(w45, 07) ^ rot(w45, 18) ^ (w45 >> 03) +% w53 +% rot(w58, 17) ^ rot(w58, 19) ^ (w58 >> 10);
      let w61 = w45 +% rot(w46, 07) ^ rot(w46, 18) ^ (w46 >> 03) +% w54 +% rot(w59, 17) ^ rot(w59, 19) ^ (w59 >> 10);
      let w62 = w46 +% rot(w47, 07) ^ rot(w47, 18) ^ (w47 >> 03) +% w55 +% rot(w60, 17) ^ rot(w60, 19) ^ (w60 >> 10);
      let w63 = w47 +% rot(w48, 07) ^ rot(w48, 18) ^ (w48 >> 03) +% w56 +% rot(w61, 17) ^ rot(w61, 19) ^ (w61 >> 10);

/*
      for ((i, j, k, l, m) in expansion_rounds.vals()) {
        // (j,k,l,m) = (i+1,i+9,i+14,i+16)
        let (v0, v1) = (msg[j], msg[l]);
        let s0 = rot(v0, 07) ^ rot(v0, 18) ^ (v0 >> 03);
        let s1 = rot(v1, 17) ^ rot(v1, 19) ^ (v1 >> 10);
        msg[m] := msg[i] +% s0 +% msg[k] +% s1;
      };
*/
      // compress
      let a_0 = nat16To32(s0h) << 16 | nat16To32(s0l);
      let b_0 = nat16To32(s1h) << 16 | nat16To32(s1l);
      let c_0 = nat16To32(s2h) << 16 | nat16To32(s2l);
      let d_0 = nat16To32(s3h) << 16 | nat16To32(s3l);
      let e_0 = nat16To32(s4h) << 16 | nat16To32(s4l);
      let f_0 = nat16To32(s5h) << 16 | nat16To32(s5l);
      let g_0 = nat16To32(s6h) << 16 | nat16To32(s6l);
      let h_0 = nat16To32(s7h) << 16 | nat16To32(s7l);
      var a = a_0;
      var b = b_0;
      var c = c_0;
      var d = d_0;
      var e = e_0;
      var f = f_0;
      var g = g_0;
      var h = h_0;
      var t = 0 : Nat32;

      t := h +% K00 +% w00 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K01 +% w01 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K02 +% w02 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K03 +% w03 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K04 +% w04 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K05 +% w05 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K06 +% w06 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K07 +% w07 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K08 +% w08 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K09 +% w09 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K10 +% w10 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K11 +% w11 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K12 +% w12 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K13 +% w13 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K14 +% w14 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K15 +% w15 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K16 +% w16 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K17 +% w17 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K18 +% w18 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K19 +% w19 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K20 +% w20 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K21 +% w21 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K22 +% w22 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K23 +% w23 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K24 +% w24 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K25 +% w25 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K26 +% w26 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K27 +% w27 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K28 +% w28 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K29 +% w29 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K30 +% w30 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K31 +% w31 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K32 +% w32 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K33 +% w33 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K34 +% w34 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K35 +% w35 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K36 +% w36 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K37 +% w37 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K38 +% w38 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K39 +% w39 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K40 +% w40 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K41 +% w41 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K42 +% w42 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K43 +% w43 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K44 +% w44 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K45 +% w45 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K46 +% w46 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K47 +% w47 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K48 +% w48 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K49 +% w49 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K50 +% w50 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K51 +% w51 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K52 +% w52 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K53 +% w53 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K54 +% w54 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K55 +% w55 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K56 +% w56 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K57 +% w57 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K58 +% w58 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K59 +% w59 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K60 +% w60 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K61 +% w61 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K62 +% w62 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
      t := h +% K63 +% w63 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);

/*
      for (i in compression_rounds.keys()) {
        let ch = (e & f) ^ (^ e & g);
        let maj = (a & b) ^ (a & c) ^ (b & c);
        let sigma0 = rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        let sigma1 = rot(e, 06) ^ rot(e, 11) ^ rot(e, 25);
        let t = h +% K[i] +% msg[i] +% ch +% sigma1;
        h := g;
        g := f;
        f := e;
        e := d +% t;
        d := c;
        c := b;
        b := a;
        a := t +% maj +% sigma0;
      };
*/
      // final addition
      a +%= a_0;
      b +%= b_0;
      c +%= c_0;
      d +%= d_0;
      e +%= e_0;
      f +%= f_0;
      g +%= g_0;
      h +%= h_0;
      s0h := nat32To16(a >> 16); s0l := nat32To16(a & 0xffff);
      s1h := nat32To16(b >> 16); s1l := nat32To16(b & 0xffff);
      s2h := nat32To16(c >> 16); s2l := nat32To16(c & 0xffff);
      s3h := nat32To16(d >> 16); s3l := nat32To16(d & 0xffff);
      s4h := nat32To16(e >> 16); s4l := nat32To16(e & 0xffff);
      s5h := nat32To16(f >> 16); s5l := nat32To16(f & 0xffff);
      s6h := nat32To16(g >> 16); s6l := nat32To16(g & 0xffff);
      s7h := nat32To16(h >> 16); s7l := nat32To16(h & 0xffff);
    };

    private func process_blocks_from_blob(blob : Blob, start : Nat) : Nat {
      let s = blob.size();
      var i = start;
      // load state registers
      var a = nat16To32(s0h) << 16 | nat16To32(s0l);
      var b = nat16To32(s1h) << 16 | nat16To32(s1l);
      var c = nat16To32(s2h) << 16 | nat16To32(s2l);
      var d = nat16To32(s3h) << 16 | nat16To32(s3l);
      var e = nat16To32(s4h) << 16 | nat16To32(s4l);
      var f = nat16To32(s5h) << 16 | nat16To32(s5l);
      var g = nat16To32(s6h) << 16 | nat16To32(s6l);
      var h = nat16To32(s7h) << 16 | nat16To32(s7l);
      var t = 0 : Nat32;
      var i_max : Nat = i + ((s - i) / 64) * 64;
      while (i < i_max) {
        let a_0 = a;
        let b_0 = b;
        let c_0 = c;
        let d_0 = d;
        let e_0 = e;
        let f_0 = f;
        let g_0 = g;
        let h_0 = h;
        let w00 = nat16To32(nat8To16(blob[i])) << 24 | nat16To32(nat8To16(blob[i+1])) << 16 | nat16To32(nat8To16(blob[i+2])) << 8 | nat16To32(nat8To16(blob[i+3]));    
        let w01 = nat16To32(nat8To16(blob[i+4])) << 24 | nat16To32(nat8To16(blob[i+5])) << 16 | nat16To32(nat8To16(blob[i+6])) << 8 | nat16To32(nat8To16(blob[i+7]));    
        let w02 = nat16To32(nat8To16(blob[i+8])) << 24 | nat16To32(nat8To16(blob[i+9])) << 16 | nat16To32(nat8To16(blob[i+10])) << 8 | nat16To32(nat8To16(blob[i+11]));    
        let w03 = nat16To32(nat8To16(blob[i+12])) << 24 | nat16To32(nat8To16(blob[i+13])) << 16 | nat16To32(nat8To16(blob[i+14])) << 8 | nat16To32(nat8To16(blob[i+15]));    
        let w04 = nat16To32(nat8To16(blob[i+16])) << 24 | nat16To32(nat8To16(blob[i+17])) << 16 | nat16To32(nat8To16(blob[i+18])) << 8 | nat16To32(nat8To16(blob[i+19]));    
        let w05 = nat16To32(nat8To16(blob[i+20])) << 24 | nat16To32(nat8To16(blob[i+21])) << 16 | nat16To32(nat8To16(blob[i+22])) << 8 | nat16To32(nat8To16(blob[i+23]));    
        let w06 = nat16To32(nat8To16(blob[i+24])) << 24 | nat16To32(nat8To16(blob[i+25])) << 16 | nat16To32(nat8To16(blob[i+26])) << 8 | nat16To32(nat8To16(blob[i+27]));    
        let w07 = nat16To32(nat8To16(blob[i+28])) << 24 | nat16To32(nat8To16(blob[i+29])) << 16 | nat16To32(nat8To16(blob[i+30])) << 8 | nat16To32(nat8To16(blob[i+31]));    
        let w08 = nat16To32(nat8To16(blob[i+32])) << 24 | nat16To32(nat8To16(blob[i+33])) << 16 | nat16To32(nat8To16(blob[i+34])) << 8 | nat16To32(nat8To16(blob[i+35]));    
        let w09 = nat16To32(nat8To16(blob[i+36])) << 24 | nat16To32(nat8To16(blob[i+37])) << 16 | nat16To32(nat8To16(blob[i+38])) << 8 | nat16To32(nat8To16(blob[i+39]));    
        let w10 = nat16To32(nat8To16(blob[i+40])) << 24 | nat16To32(nat8To16(blob[i+41])) << 16 | nat16To32(nat8To16(blob[i+42])) << 8 | nat16To32(nat8To16(blob[i+43]));    
        let w11 = nat16To32(nat8To16(blob[i+44])) << 24 | nat16To32(nat8To16(blob[i+45])) << 16 | nat16To32(nat8To16(blob[i+46])) << 8 | nat16To32(nat8To16(blob[i+47]));    
        let w12 = nat16To32(nat8To16(blob[i+48])) << 24 | nat16To32(nat8To16(blob[i+49])) << 16 | nat16To32(nat8To16(blob[i+50])) << 8 | nat16To32(nat8To16(blob[i+51]));    
        let w13 = nat16To32(nat8To16(blob[i+52])) << 24 | nat16To32(nat8To16(blob[i+53])) << 16 | nat16To32(nat8To16(blob[i+54])) << 8 | nat16To32(nat8To16(blob[i+55]));    
        let w14 = nat16To32(nat8To16(blob[i+56])) << 24 | nat16To32(nat8To16(blob[i+57])) << 16 | nat16To32(nat8To16(blob[i+58])) << 8 | nat16To32(nat8To16(blob[i+59]));    
        let w15 = nat16To32(nat8To16(blob[i+60])) << 24 | nat16To32(nat8To16(blob[i+61])) << 16 | nat16To32(nat8To16(blob[i+62])) << 8 | nat16To32(nat8To16(blob[i+63]));    
        let w16 = w00 +% rot(w01, 07) ^ rot(w01, 18) ^ (w01 >> 03) +% w09 +% rot(w14, 17) ^ rot(w14, 19) ^ (w14 >> 10);
        let w17 = w01 +% rot(w02, 07) ^ rot(w02, 18) ^ (w02 >> 03) +% w10 +% rot(w15, 17) ^ rot(w15, 19) ^ (w15 >> 10);
        let w18 = w02 +% rot(w03, 07) ^ rot(w03, 18) ^ (w03 >> 03) +% w11 +% rot(w16, 17) ^ rot(w16, 19) ^ (w16 >> 10);
        let w19 = w03 +% rot(w04, 07) ^ rot(w04, 18) ^ (w04 >> 03) +% w12 +% rot(w17, 17) ^ rot(w17, 19) ^ (w17 >> 10);
        let w20 = w04 +% rot(w05, 07) ^ rot(w05, 18) ^ (w05 >> 03) +% w13 +% rot(w18, 17) ^ rot(w18, 19) ^ (w18 >> 10);
        let w21 = w05 +% rot(w06, 07) ^ rot(w06, 18) ^ (w06 >> 03) +% w14 +% rot(w19, 17) ^ rot(w19, 19) ^ (w19 >> 10);
        let w22 = w06 +% rot(w07, 07) ^ rot(w07, 18) ^ (w07 >> 03) +% w15 +% rot(w20, 17) ^ rot(w20, 19) ^ (w20 >> 10);
        let w23 = w07 +% rot(w08, 07) ^ rot(w08, 18) ^ (w08 >> 03) +% w16 +% rot(w21, 17) ^ rot(w21, 19) ^ (w21 >> 10);
        let w24 = w08 +% rot(w09, 07) ^ rot(w09, 18) ^ (w09 >> 03) +% w17 +% rot(w22, 17) ^ rot(w22, 19) ^ (w22 >> 10);
        let w25 = w09 +% rot(w10, 07) ^ rot(w10, 18) ^ (w10 >> 03) +% w18 +% rot(w23, 17) ^ rot(w23, 19) ^ (w23 >> 10);
        let w26 = w10 +% rot(w11, 07) ^ rot(w11, 18) ^ (w11 >> 03) +% w19 +% rot(w24, 17) ^ rot(w24, 19) ^ (w24 >> 10);
        let w27 = w11 +% rot(w12, 07) ^ rot(w12, 18) ^ (w12 >> 03) +% w20 +% rot(w25, 17) ^ rot(w25, 19) ^ (w25 >> 10);
        let w28 = w12 +% rot(w13, 07) ^ rot(w13, 18) ^ (w13 >> 03) +% w21 +% rot(w26, 17) ^ rot(w26, 19) ^ (w26 >> 10);
        let w29 = w13 +% rot(w14, 07) ^ rot(w14, 18) ^ (w14 >> 03) +% w22 +% rot(w27, 17) ^ rot(w27, 19) ^ (w27 >> 10);
        let w30 = w14 +% rot(w15, 07) ^ rot(w15, 18) ^ (w15 >> 03) +% w23 +% rot(w28, 17) ^ rot(w28, 19) ^ (w28 >> 10);
        let w31 = w15 +% rot(w16, 07) ^ rot(w16, 18) ^ (w16 >> 03) +% w24 +% rot(w29, 17) ^ rot(w29, 19) ^ (w29 >> 10);
        let w32 = w16 +% rot(w17, 07) ^ rot(w17, 18) ^ (w17 >> 03) +% w25 +% rot(w30, 17) ^ rot(w30, 19) ^ (w30 >> 10);
        let w33 = w17 +% rot(w18, 07) ^ rot(w18, 18) ^ (w18 >> 03) +% w26 +% rot(w31, 17) ^ rot(w31, 19) ^ (w31 >> 10);
        let w34 = w18 +% rot(w19, 07) ^ rot(w19, 18) ^ (w19 >> 03) +% w27 +% rot(w32, 17) ^ rot(w32, 19) ^ (w32 >> 10);
        let w35 = w19 +% rot(w20, 07) ^ rot(w20, 18) ^ (w20 >> 03) +% w28 +% rot(w33, 17) ^ rot(w33, 19) ^ (w33 >> 10);
        let w36 = w20 +% rot(w21, 07) ^ rot(w21, 18) ^ (w21 >> 03) +% w29 +% rot(w34, 17) ^ rot(w34, 19) ^ (w34 >> 10);
        let w37 = w21 +% rot(w22, 07) ^ rot(w22, 18) ^ (w22 >> 03) +% w30 +% rot(w35, 17) ^ rot(w35, 19) ^ (w35 >> 10);
        let w38 = w22 +% rot(w23, 07) ^ rot(w23, 18) ^ (w23 >> 03) +% w31 +% rot(w36, 17) ^ rot(w36, 19) ^ (w36 >> 10);
        let w39 = w23 +% rot(w24, 07) ^ rot(w24, 18) ^ (w24 >> 03) +% w32 +% rot(w37, 17) ^ rot(w37, 19) ^ (w37 >> 10);
        let w40 = w24 +% rot(w25, 07) ^ rot(w25, 18) ^ (w25 >> 03) +% w33 +% rot(w38, 17) ^ rot(w38, 19) ^ (w38 >> 10);
        let w41 = w25 +% rot(w26, 07) ^ rot(w26, 18) ^ (w26 >> 03) +% w34 +% rot(w39, 17) ^ rot(w39, 19) ^ (w39 >> 10);
        let w42 = w26 +% rot(w27, 07) ^ rot(w27, 18) ^ (w27 >> 03) +% w35 +% rot(w40, 17) ^ rot(w40, 19) ^ (w40 >> 10);
        let w43 = w27 +% rot(w28, 07) ^ rot(w28, 18) ^ (w28 >> 03) +% w36 +% rot(w41, 17) ^ rot(w41, 19) ^ (w41 >> 10);
        let w44 = w28 +% rot(w29, 07) ^ rot(w29, 18) ^ (w29 >> 03) +% w37 +% rot(w42, 17) ^ rot(w42, 19) ^ (w42 >> 10);
        let w45 = w29 +% rot(w30, 07) ^ rot(w30, 18) ^ (w30 >> 03) +% w38 +% rot(w43, 17) ^ rot(w43, 19) ^ (w43 >> 10);
        let w46 = w30 +% rot(w31, 07) ^ rot(w31, 18) ^ (w31 >> 03) +% w39 +% rot(w44, 17) ^ rot(w44, 19) ^ (w44 >> 10);
        let w47 = w31 +% rot(w32, 07) ^ rot(w32, 18) ^ (w32 >> 03) +% w40 +% rot(w45, 17) ^ rot(w45, 19) ^ (w45 >> 10);
        let w48 = w32 +% rot(w33, 07) ^ rot(w33, 18) ^ (w33 >> 03) +% w41 +% rot(w46, 17) ^ rot(w46, 19) ^ (w46 >> 10);
        let w49 = w33 +% rot(w34, 07) ^ rot(w34, 18) ^ (w34 >> 03) +% w42 +% rot(w47, 17) ^ rot(w47, 19) ^ (w47 >> 10);
        let w50 = w34 +% rot(w35, 07) ^ rot(w35, 18) ^ (w35 >> 03) +% w43 +% rot(w48, 17) ^ rot(w48, 19) ^ (w48 >> 10);
        let w51 = w35 +% rot(w36, 07) ^ rot(w36, 18) ^ (w36 >> 03) +% w44 +% rot(w49, 17) ^ rot(w49, 19) ^ (w49 >> 10);
        let w52 = w36 +% rot(w37, 07) ^ rot(w37, 18) ^ (w37 >> 03) +% w45 +% rot(w50, 17) ^ rot(w50, 19) ^ (w50 >> 10);
        let w53 = w37 +% rot(w38, 07) ^ rot(w38, 18) ^ (w38 >> 03) +% w46 +% rot(w51, 17) ^ rot(w51, 19) ^ (w51 >> 10);
        let w54 = w38 +% rot(w39, 07) ^ rot(w39, 18) ^ (w39 >> 03) +% w47 +% rot(w52, 17) ^ rot(w52, 19) ^ (w52 >> 10);
        let w55 = w39 +% rot(w40, 07) ^ rot(w40, 18) ^ (w40 >> 03) +% w48 +% rot(w53, 17) ^ rot(w53, 19) ^ (w53 >> 10);
        let w56 = w40 +% rot(w41, 07) ^ rot(w41, 18) ^ (w41 >> 03) +% w49 +% rot(w54, 17) ^ rot(w54, 19) ^ (w54 >> 10);
        let w57 = w41 +% rot(w42, 07) ^ rot(w42, 18) ^ (w42 >> 03) +% w50 +% rot(w55, 17) ^ rot(w55, 19) ^ (w55 >> 10);
        let w58 = w42 +% rot(w43, 07) ^ rot(w43, 18) ^ (w43 >> 03) +% w51 +% rot(w56, 17) ^ rot(w56, 19) ^ (w56 >> 10);
        let w59 = w43 +% rot(w44, 07) ^ rot(w44, 18) ^ (w44 >> 03) +% w52 +% rot(w57, 17) ^ rot(w57, 19) ^ (w57 >> 10);
        let w60 = w44 +% rot(w45, 07) ^ rot(w45, 18) ^ (w45 >> 03) +% w53 +% rot(w58, 17) ^ rot(w58, 19) ^ (w58 >> 10);
        let w61 = w45 +% rot(w46, 07) ^ rot(w46, 18) ^ (w46 >> 03) +% w54 +% rot(w59, 17) ^ rot(w59, 19) ^ (w59 >> 10);
        let w62 = w46 +% rot(w47, 07) ^ rot(w47, 18) ^ (w47 >> 03) +% w55 +% rot(w60, 17) ^ rot(w60, 19) ^ (w60 >> 10);
        let w63 = w47 +% rot(w48, 07) ^ rot(w48, 18) ^ (w48 >> 03) +% w56 +% rot(w61, 17) ^ rot(w61, 19) ^ (w61 >> 10);

        t := h +% K00 +% w00 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K01 +% w01 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K02 +% w02 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K03 +% w03 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K04 +% w04 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K05 +% w05 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K06 +% w06 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K07 +% w07 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K08 +% w08 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K09 +% w09 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K10 +% w10 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K11 +% w11 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K12 +% w12 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K13 +% w13 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K14 +% w14 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K15 +% w15 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K16 +% w16 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K17 +% w17 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K18 +% w18 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K19 +% w19 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K20 +% w20 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K21 +% w21 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K22 +% w22 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K23 +% w23 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K24 +% w24 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K25 +% w25 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K26 +% w26 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K27 +% w27 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K28 +% w28 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K29 +% w29 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K30 +% w30 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K31 +% w31 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K32 +% w32 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K33 +% w33 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K34 +% w34 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K35 +% w35 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K36 +% w36 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K37 +% w37 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K38 +% w38 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K39 +% w39 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K40 +% w40 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K41 +% w41 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K42 +% w42 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K43 +% w43 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K44 +% w44 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K45 +% w45 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K46 +% w46 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K47 +% w47 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K48 +% w48 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K49 +% w49 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K50 +% w50 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K51 +% w51 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K52 +% w52 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K53 +% w53 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K54 +% w54 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K55 +% w55 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K56 +% w56 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K57 +% w57 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K58 +% w58 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K59 +% w59 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K60 +% w60 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K61 +% w61 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K62 +% w62 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K63 +% w63 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);

        // final addition
        a +%= a_0;
        b +%= b_0;
        c +%= c_0;
        d +%= d_0;
        e +%= e_0;
        f +%= f_0;
        g +%= g_0;
        h +%= h_0;

        // counters
        i += 64;
        i_block +%= 1;
      };
      // write state back to registers
      s0h := nat32To16(a >> 16); s0l := nat32To16(a & 0xffff);
      s1h := nat32To16(b >> 16); s1l := nat32To16(b & 0xffff);
      s2h := nat32To16(c >> 16); s2l := nat32To16(c & 0xffff);
      s3h := nat32To16(d >> 16); s3l := nat32To16(d & 0xffff);
      s4h := nat32To16(e >> 16); s4l := nat32To16(e & 0xffff);
      s5h := nat32To16(f >> 16); s5l := nat32To16(f & 0xffff);
      s6h := nat32To16(g >> 16); s6l := nat32To16(g & 0xffff);
      s7h := nat32To16(h >> 16); s7l := nat32To16(h & 0xffff);

      return i
    };

    private func process_blocks_from_arr(arr : [Nat8], start : Nat) : Nat {
      let s = arr.size();
      var i = start;
      // load state registers
      var a = nat16To32(s0h) << 16 | nat16To32(s0l);
      var b = nat16To32(s1h) << 16 | nat16To32(s1l);
      var c = nat16To32(s2h) << 16 | nat16To32(s2l);
      var d = nat16To32(s3h) << 16 | nat16To32(s3l);
      var e = nat16To32(s4h) << 16 | nat16To32(s4l);
      var f = nat16To32(s5h) << 16 | nat16To32(s5l);
      var g = nat16To32(s6h) << 16 | nat16To32(s6l);
      var h = nat16To32(s7h) << 16 | nat16To32(s7l);
      var t = 0 : Nat32;
      var i_max : Nat = i + ((s - i) / 64) * 64;
      while (i < i_max) {
        let a_0 = a;
        let b_0 = b;
        let c_0 = c;
        let d_0 = d;
        let e_0 = e;
        let f_0 = f;
        let g_0 = g;
        let h_0 = h;
        let w00 = nat16To32(nat8To16(arr[i])) << 24 | nat16To32(nat8To16(arr[i+1])) << 16 | nat16To32(nat8To16(arr[i+2])) << 8 | nat16To32(nat8To16(arr[i+3]));    
        let w01 = nat16To32(nat8To16(arr[i+4])) << 24 | nat16To32(nat8To16(arr[i+5])) << 16 | nat16To32(nat8To16(arr[i+6])) << 8 | nat16To32(nat8To16(arr[i+7]));    
        let w02 = nat16To32(nat8To16(arr[i+8])) << 24 | nat16To32(nat8To16(arr[i+9])) << 16 | nat16To32(nat8To16(arr[i+10])) << 8 | nat16To32(nat8To16(arr[i+11]));    
        let w03 = nat16To32(nat8To16(arr[i+12])) << 24 | nat16To32(nat8To16(arr[i+13])) << 16 | nat16To32(nat8To16(arr[i+14])) << 8 | nat16To32(nat8To16(arr[i+15]));    
        let w04 = nat16To32(nat8To16(arr[i+16])) << 24 | nat16To32(nat8To16(arr[i+17])) << 16 | nat16To32(nat8To16(arr[i+18])) << 8 | nat16To32(nat8To16(arr[i+19]));    
        let w05 = nat16To32(nat8To16(arr[i+20])) << 24 | nat16To32(nat8To16(arr[i+21])) << 16 | nat16To32(nat8To16(arr[i+22])) << 8 | nat16To32(nat8To16(arr[i+23]));    
        let w06 = nat16To32(nat8To16(arr[i+24])) << 24 | nat16To32(nat8To16(arr[i+25])) << 16 | nat16To32(nat8To16(arr[i+26])) << 8 | nat16To32(nat8To16(arr[i+27]));    
        let w07 = nat16To32(nat8To16(arr[i+28])) << 24 | nat16To32(nat8To16(arr[i+29])) << 16 | nat16To32(nat8To16(arr[i+30])) << 8 | nat16To32(nat8To16(arr[i+31]));    
        let w08 = nat16To32(nat8To16(arr[i+32])) << 24 | nat16To32(nat8To16(arr[i+33])) << 16 | nat16To32(nat8To16(arr[i+34])) << 8 | nat16To32(nat8To16(arr[i+35]));    
        let w09 = nat16To32(nat8To16(arr[i+36])) << 24 | nat16To32(nat8To16(arr[i+37])) << 16 | nat16To32(nat8To16(arr[i+38])) << 8 | nat16To32(nat8To16(arr[i+39]));    
        let w10 = nat16To32(nat8To16(arr[i+40])) << 24 | nat16To32(nat8To16(arr[i+41])) << 16 | nat16To32(nat8To16(arr[i+42])) << 8 | nat16To32(nat8To16(arr[i+43]));    
        let w11 = nat16To32(nat8To16(arr[i+44])) << 24 | nat16To32(nat8To16(arr[i+45])) << 16 | nat16To32(nat8To16(arr[i+46])) << 8 | nat16To32(nat8To16(arr[i+47]));    
        let w12 = nat16To32(nat8To16(arr[i+48])) << 24 | nat16To32(nat8To16(arr[i+49])) << 16 | nat16To32(nat8To16(arr[i+50])) << 8 | nat16To32(nat8To16(arr[i+51]));    
        let w13 = nat16To32(nat8To16(arr[i+52])) << 24 | nat16To32(nat8To16(arr[i+53])) << 16 | nat16To32(nat8To16(arr[i+54])) << 8 | nat16To32(nat8To16(arr[i+55]));    
        let w14 = nat16To32(nat8To16(arr[i+56])) << 24 | nat16To32(nat8To16(arr[i+57])) << 16 | nat16To32(nat8To16(arr[i+58])) << 8 | nat16To32(nat8To16(arr[i+59]));    
        let w15 = nat16To32(nat8To16(arr[i+60])) << 24 | nat16To32(nat8To16(arr[i+61])) << 16 | nat16To32(nat8To16(arr[i+62])) << 8 | nat16To32(nat8To16(arr[i+63]));    
        let w16 = w00 +% rot(w01, 07) ^ rot(w01, 18) ^ (w01 >> 03) +% w09 +% rot(w14, 17) ^ rot(w14, 19) ^ (w14 >> 10);
        let w17 = w01 +% rot(w02, 07) ^ rot(w02, 18) ^ (w02 >> 03) +% w10 +% rot(w15, 17) ^ rot(w15, 19) ^ (w15 >> 10);
        let w18 = w02 +% rot(w03, 07) ^ rot(w03, 18) ^ (w03 >> 03) +% w11 +% rot(w16, 17) ^ rot(w16, 19) ^ (w16 >> 10);
        let w19 = w03 +% rot(w04, 07) ^ rot(w04, 18) ^ (w04 >> 03) +% w12 +% rot(w17, 17) ^ rot(w17, 19) ^ (w17 >> 10);
        let w20 = w04 +% rot(w05, 07) ^ rot(w05, 18) ^ (w05 >> 03) +% w13 +% rot(w18, 17) ^ rot(w18, 19) ^ (w18 >> 10);
        let w21 = w05 +% rot(w06, 07) ^ rot(w06, 18) ^ (w06 >> 03) +% w14 +% rot(w19, 17) ^ rot(w19, 19) ^ (w19 >> 10);
        let w22 = w06 +% rot(w07, 07) ^ rot(w07, 18) ^ (w07 >> 03) +% w15 +% rot(w20, 17) ^ rot(w20, 19) ^ (w20 >> 10);
        let w23 = w07 +% rot(w08, 07) ^ rot(w08, 18) ^ (w08 >> 03) +% w16 +% rot(w21, 17) ^ rot(w21, 19) ^ (w21 >> 10);
        let w24 = w08 +% rot(w09, 07) ^ rot(w09, 18) ^ (w09 >> 03) +% w17 +% rot(w22, 17) ^ rot(w22, 19) ^ (w22 >> 10);
        let w25 = w09 +% rot(w10, 07) ^ rot(w10, 18) ^ (w10 >> 03) +% w18 +% rot(w23, 17) ^ rot(w23, 19) ^ (w23 >> 10);
        let w26 = w10 +% rot(w11, 07) ^ rot(w11, 18) ^ (w11 >> 03) +% w19 +% rot(w24, 17) ^ rot(w24, 19) ^ (w24 >> 10);
        let w27 = w11 +% rot(w12, 07) ^ rot(w12, 18) ^ (w12 >> 03) +% w20 +% rot(w25, 17) ^ rot(w25, 19) ^ (w25 >> 10);
        let w28 = w12 +% rot(w13, 07) ^ rot(w13, 18) ^ (w13 >> 03) +% w21 +% rot(w26, 17) ^ rot(w26, 19) ^ (w26 >> 10);
        let w29 = w13 +% rot(w14, 07) ^ rot(w14, 18) ^ (w14 >> 03) +% w22 +% rot(w27, 17) ^ rot(w27, 19) ^ (w27 >> 10);
        let w30 = w14 +% rot(w15, 07) ^ rot(w15, 18) ^ (w15 >> 03) +% w23 +% rot(w28, 17) ^ rot(w28, 19) ^ (w28 >> 10);
        let w31 = w15 +% rot(w16, 07) ^ rot(w16, 18) ^ (w16 >> 03) +% w24 +% rot(w29, 17) ^ rot(w29, 19) ^ (w29 >> 10);
        let w32 = w16 +% rot(w17, 07) ^ rot(w17, 18) ^ (w17 >> 03) +% w25 +% rot(w30, 17) ^ rot(w30, 19) ^ (w30 >> 10);
        let w33 = w17 +% rot(w18, 07) ^ rot(w18, 18) ^ (w18 >> 03) +% w26 +% rot(w31, 17) ^ rot(w31, 19) ^ (w31 >> 10);
        let w34 = w18 +% rot(w19, 07) ^ rot(w19, 18) ^ (w19 >> 03) +% w27 +% rot(w32, 17) ^ rot(w32, 19) ^ (w32 >> 10);
        let w35 = w19 +% rot(w20, 07) ^ rot(w20, 18) ^ (w20 >> 03) +% w28 +% rot(w33, 17) ^ rot(w33, 19) ^ (w33 >> 10);
        let w36 = w20 +% rot(w21, 07) ^ rot(w21, 18) ^ (w21 >> 03) +% w29 +% rot(w34, 17) ^ rot(w34, 19) ^ (w34 >> 10);
        let w37 = w21 +% rot(w22, 07) ^ rot(w22, 18) ^ (w22 >> 03) +% w30 +% rot(w35, 17) ^ rot(w35, 19) ^ (w35 >> 10);
        let w38 = w22 +% rot(w23, 07) ^ rot(w23, 18) ^ (w23 >> 03) +% w31 +% rot(w36, 17) ^ rot(w36, 19) ^ (w36 >> 10);
        let w39 = w23 +% rot(w24, 07) ^ rot(w24, 18) ^ (w24 >> 03) +% w32 +% rot(w37, 17) ^ rot(w37, 19) ^ (w37 >> 10);
        let w40 = w24 +% rot(w25, 07) ^ rot(w25, 18) ^ (w25 >> 03) +% w33 +% rot(w38, 17) ^ rot(w38, 19) ^ (w38 >> 10);
        let w41 = w25 +% rot(w26, 07) ^ rot(w26, 18) ^ (w26 >> 03) +% w34 +% rot(w39, 17) ^ rot(w39, 19) ^ (w39 >> 10);
        let w42 = w26 +% rot(w27, 07) ^ rot(w27, 18) ^ (w27 >> 03) +% w35 +% rot(w40, 17) ^ rot(w40, 19) ^ (w40 >> 10);
        let w43 = w27 +% rot(w28, 07) ^ rot(w28, 18) ^ (w28 >> 03) +% w36 +% rot(w41, 17) ^ rot(w41, 19) ^ (w41 >> 10);
        let w44 = w28 +% rot(w29, 07) ^ rot(w29, 18) ^ (w29 >> 03) +% w37 +% rot(w42, 17) ^ rot(w42, 19) ^ (w42 >> 10);
        let w45 = w29 +% rot(w30, 07) ^ rot(w30, 18) ^ (w30 >> 03) +% w38 +% rot(w43, 17) ^ rot(w43, 19) ^ (w43 >> 10);
        let w46 = w30 +% rot(w31, 07) ^ rot(w31, 18) ^ (w31 >> 03) +% w39 +% rot(w44, 17) ^ rot(w44, 19) ^ (w44 >> 10);
        let w47 = w31 +% rot(w32, 07) ^ rot(w32, 18) ^ (w32 >> 03) +% w40 +% rot(w45, 17) ^ rot(w45, 19) ^ (w45 >> 10);
        let w48 = w32 +% rot(w33, 07) ^ rot(w33, 18) ^ (w33 >> 03) +% w41 +% rot(w46, 17) ^ rot(w46, 19) ^ (w46 >> 10);
        let w49 = w33 +% rot(w34, 07) ^ rot(w34, 18) ^ (w34 >> 03) +% w42 +% rot(w47, 17) ^ rot(w47, 19) ^ (w47 >> 10);
        let w50 = w34 +% rot(w35, 07) ^ rot(w35, 18) ^ (w35 >> 03) +% w43 +% rot(w48, 17) ^ rot(w48, 19) ^ (w48 >> 10);
        let w51 = w35 +% rot(w36, 07) ^ rot(w36, 18) ^ (w36 >> 03) +% w44 +% rot(w49, 17) ^ rot(w49, 19) ^ (w49 >> 10);
        let w52 = w36 +% rot(w37, 07) ^ rot(w37, 18) ^ (w37 >> 03) +% w45 +% rot(w50, 17) ^ rot(w50, 19) ^ (w50 >> 10);
        let w53 = w37 +% rot(w38, 07) ^ rot(w38, 18) ^ (w38 >> 03) +% w46 +% rot(w51, 17) ^ rot(w51, 19) ^ (w51 >> 10);
        let w54 = w38 +% rot(w39, 07) ^ rot(w39, 18) ^ (w39 >> 03) +% w47 +% rot(w52, 17) ^ rot(w52, 19) ^ (w52 >> 10);
        let w55 = w39 +% rot(w40, 07) ^ rot(w40, 18) ^ (w40 >> 03) +% w48 +% rot(w53, 17) ^ rot(w53, 19) ^ (w53 >> 10);
        let w56 = w40 +% rot(w41, 07) ^ rot(w41, 18) ^ (w41 >> 03) +% w49 +% rot(w54, 17) ^ rot(w54, 19) ^ (w54 >> 10);
        let w57 = w41 +% rot(w42, 07) ^ rot(w42, 18) ^ (w42 >> 03) +% w50 +% rot(w55, 17) ^ rot(w55, 19) ^ (w55 >> 10);
        let w58 = w42 +% rot(w43, 07) ^ rot(w43, 18) ^ (w43 >> 03) +% w51 +% rot(w56, 17) ^ rot(w56, 19) ^ (w56 >> 10);
        let w59 = w43 +% rot(w44, 07) ^ rot(w44, 18) ^ (w44 >> 03) +% w52 +% rot(w57, 17) ^ rot(w57, 19) ^ (w57 >> 10);
        let w60 = w44 +% rot(w45, 07) ^ rot(w45, 18) ^ (w45 >> 03) +% w53 +% rot(w58, 17) ^ rot(w58, 19) ^ (w58 >> 10);
        let w61 = w45 +% rot(w46, 07) ^ rot(w46, 18) ^ (w46 >> 03) +% w54 +% rot(w59, 17) ^ rot(w59, 19) ^ (w59 >> 10);
        let w62 = w46 +% rot(w47, 07) ^ rot(w47, 18) ^ (w47 >> 03) +% w55 +% rot(w60, 17) ^ rot(w60, 19) ^ (w60 >> 10);
        let w63 = w47 +% rot(w48, 07) ^ rot(w48, 18) ^ (w48 >> 03) +% w56 +% rot(w61, 17) ^ rot(w61, 19) ^ (w61 >> 10);

        t := h +% K00 +% w00 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K01 +% w01 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K02 +% w02 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K03 +% w03 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K04 +% w04 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K05 +% w05 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K06 +% w06 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K07 +% w07 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K08 +% w08 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K09 +% w09 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K10 +% w10 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K11 +% w11 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K12 +% w12 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K13 +% w13 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K14 +% w14 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K15 +% w15 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K16 +% w16 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K17 +% w17 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K18 +% w18 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K19 +% w19 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K20 +% w20 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K21 +% w21 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K22 +% w22 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K23 +% w23 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K24 +% w24 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K25 +% w25 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K26 +% w26 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K27 +% w27 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K28 +% w28 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K29 +% w29 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K30 +% w30 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K31 +% w31 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K32 +% w32 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K33 +% w33 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K34 +% w34 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K35 +% w35 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K36 +% w36 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K37 +% w37 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K38 +% w38 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K39 +% w39 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K40 +% w40 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K41 +% w41 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K42 +% w42 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K43 +% w43 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K44 +% w44 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K45 +% w45 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K46 +% w46 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K47 +% w47 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K48 +% w48 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K49 +% w49 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K50 +% w50 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K51 +% w51 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K52 +% w52 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K53 +% w53 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K54 +% w54 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K55 +% w55 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K56 +% w56 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K57 +% w57 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K58 +% w58 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K59 +% w59 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K60 +% w60 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K61 +% w61 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K62 +% w62 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);
        t := h +% K63 +% w63 +% (e & f) ^ (^ e & g) +% rot(e, 06) ^ rot(e, 11) ^ rot(e, 25); h := g; g := f; f := e; e := d +% t; d := c; c := b; b := a; a := t +% (b & c) ^ (b & d) ^ (c & d) +% rot(a, 02) ^ rot(a, 13) ^ rot(a, 22);

        // final addition
        a +%= a_0;
        b +%= b_0;
        c +%= c_0;
        d +%= d_0;
        e +%= e_0;
        f +%= f_0;
        g +%= g_0;
        h +%= h_0;

        // counters
        i += 64;
        i_block +%= 1;
      };
      // write state back to registers
      s0h := nat32To16(a >> 16); s0l := nat32To16(a & 0xffff);
      s1h := nat32To16(b >> 16); s1l := nat32To16(b & 0xffff);
      s2h := nat32To16(c >> 16); s2l := nat32To16(c & 0xffff);
      s3h := nat32To16(d >> 16); s3l := nat32To16(d & 0xffff);
      s4h := nat32To16(e >> 16); s4l := nat32To16(e & 0xffff);
      s5h := nat32To16(f >> 16); s5l := nat32To16(f & 0xffff);
      s6h := nat32To16(g >> 16); s6l := nat32To16(g & 0xffff);
      s7h := nat32To16(h >> 16); s7l := nat32To16(h & 0xffff);

      return i
    };

    // Note: setting i_max always to s - 1 also works (only for multiples of 2).
    public func writeIter(iter : { next() : ?Nat8 }) : () {
      label reading loop {
        switch (iter.next()) {
          case (?val) {
            // The following is an inlined version of writeByte(val)
            if (high) {
              word := nat8To16(val) << 8;
              high := false;
            } else {
              msg[Nat8.toNat(i_msg)] := word ^ nat8To16(val);
              i_msg +%= 1;
              high := true;
            };
            if (i_msg == 32) {
              process_block_from_buffer();
              i_msg := 0;
              i_block +%= 1;
            };
            continue reading;
          };
          case (null) {
            break reading;
          };
        };
      };
    };

    public func writeBlob(blob : Blob) : () {
      let s = blob.size();
      if (s == 0) return;
      var i = 0;
      if (i_msg > 0 or not high) {
        i := write_blob_to_buffer(blob, 0);
      };
      i := process_blocks_from_blob(blob, i);
      ignore write_blob_to_buffer(blob, i);
    };

    public func writeArray(arr : [Nat8]) : () {
      let s = arr.size();
      if (s == 0) return;
      var i = 0;
      if (i_msg > 0 or not high) {
        i := write_arr_to_buffer(arr, 0);
      };
      i := process_blocks_from_arr(arr, i);
      ignore write_arr_to_buffer(arr, i);
    };

    // Write blob to buffer until either the block is full or the end of the blob is reached
    // The return value refers to the interval that was written in the form [start,end)
    func write_blob_to_buffer(blob : Blob, start : Nat) : (end : Nat) {
      let s = blob.size();
      if (start >= s) return start;
      var i = start;
      if (not high) {
        writeByte(blob[i]);
        i += 1;
      };
      let i_max : Nat = i + ((s - i) / 2) * 2;
      while (i < i_max) {
        msg[Nat8.toNat(i_msg)] := nat8To16(blob[i]) << 8 ^ nat8To16(blob[i+1]);
        i_msg +%= 1;
        i += 2;
        if (i_msg == 32) {
          process_block_from_buffer();
          i_msg := 0;
          i_block +%= 1;
          return i;
        };
      };
      while (i < s) {
        writeByte(blob[i]);
        i += 1;
      };
      return i;
    };

    // Write array to buffer until either the block is full or the end of the array is reached
    // The return value refers to the interval that was written in the form [start,end)
    func write_arr_to_buffer(arr : [Nat8], start : Nat) : Nat {
      let s = arr.size();
      if (start >= s) return start;
      var i = start;
      if (not high) {
        writeByte(arr[i]);
        i += 1;
      };
      let i_max : Nat = i + ((s - i) / 2) * 2;
      while (i < i_max) {
        msg[Nat8.toNat(i_msg)] := nat8To16(arr[i]) << 8 ^ nat8To16(arr[i+1]);
        i_msg +%= 1;
        i += 2;
        if (i_msg == 32) {
          process_block_from_buffer();
          i_msg := 0;
          i_block +%= 1;
          return i;
        };
      };
      while (i < s) {
        writeByte(arr[i]);
        i += 1;
      };
      return i;
    };

    public func sum() : Blob {
      writePadding();

      let d0 = Nat16.toNat8(s0h >> 8);
      let d1 = Nat16.toNat8(s0h & 0xff);
      let d2 = Nat16.toNat8(s0l >> 8);
      let d3 = Nat16.toNat8(s0l & 0xff);
      let d4 = Nat16.toNat8(s1h >> 8);
      let d5 = Nat16.toNat8(s1h & 0xff);
      let d6 = Nat16.toNat8(s1l >> 8);
      let d7 = Nat16.toNat8(s1l & 0xff);
      let d8 = Nat16.toNat8(s2h >> 8);
      let d9 = Nat16.toNat8(s2h & 0xff);
      let d10 = Nat16.toNat8(s2l >> 8);
      let d11 = Nat16.toNat8(s2l & 0xff);
      let d12 = Nat16.toNat8(s3h >> 8);
      let d13 = Nat16.toNat8(s3h & 0xff);
      let d14 = Nat16.toNat8(s3l >> 8);
      let d15 = Nat16.toNat8(s3l & 0xff);
      let d16 = Nat16.toNat8(s4h >> 8);
      let d17 = Nat16.toNat8(s4h & 0xff);
      let d18 = Nat16.toNat8(s4l >> 8);
      let d19 = Nat16.toNat8(s4l & 0xff);
      let d20 = Nat16.toNat8(s5h >> 8);
      let d21 = Nat16.toNat8(s5h & 0xff);
      let d22 = Nat16.toNat8(s5l >> 8);
      let d23 = Nat16.toNat8(s5l & 0xff);
      let d24 = Nat16.toNat8(s6h >> 8);
      let d25 = Nat16.toNat8(s6h & 0xff);
      let d26 = Nat16.toNat8(s6l >> 8);
      let d27 = Nat16.toNat8(s6l & 0xff);
      let d28 = Nat16.toNat8(s7h >> 8);
      let d29 = Nat16.toNat8(s7h & 0xff);
      let d30 = Nat16.toNat8(s7l >> 8);
      let d31 = Nat16.toNat8(s7l & 0xff);

      return Prim.arrayToBlob(
        if (algo_ == #sha224)
          [ d0, d1, d2, d3, d4, d5, d6, d7,
            d8, d9, d10, d11, d12, d13, d14, d15,
            d16, d17, d18, d19, d20, d21, d22, d23,
            d24, d25, d26, d27
          ]
        else
          [
            d0, d1, d2, d3, d4, d5, d6, d7,
            d8, d9, d10, d11, d12, d13, d14, d15,
            d16, d17, d18, d19, d20, d21, d22, d23,
            d24, d25, d26, d27, d28, d29, d30, d31
          ]
        );
    };
  }; // class Digest

  // Calculate SHA2 hash digest from Iter.
  public func fromIter(algo : Algorithm, iter : { next() : ?Nat8 }) : Blob {
    let digest = Digest(algo);
    digest.writeIter(iter);
    return digest.sum();
  };

  // Calculate SHA256 hash digest from [Nat8].
  public func fromArray(algo : Algorithm, arr : [Nat8]) : Blob {
    let digest = Digest(algo);
    digest.writeArray(arr);
    return digest.sum();
  };

  /// Calculate the SHA2 hash digest from `Blob`.
  /// Allowed values for `algo` are: `#sha224`, `#256`
  public func fromBlob(algo : Algorithm, b : Blob) : Blob {
    let digest = Digest(algo);
    digest.writeBlob(b);
    return digest.sum();
  };
};